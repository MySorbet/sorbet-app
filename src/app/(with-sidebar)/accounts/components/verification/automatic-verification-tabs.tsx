import { useEffect, useState } from 'react';

import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useScopedLocalStorage } from '@/hooks/use-scoped-local-storage';
import { BridgeCustomer } from '@/types/bridge';

import {
  VERIFICATION_END_STATES,
  VerificationEndState,
  VerificationTab,
  VerificationTabs,
} from './verification-tabs';

/**
 * Fetch the bridge customer and calculate the selected tab based on the customer's status.
 *
 * The selected tab is then passed to the `VerificationTabs` component.
 */
export const AutomaticVerificationTabs = ({
  className,
}: {
  className?: string;
}) => {
  const { data: customer, isPending } = useBridgeCustomer();

  const [isIndeterminate, setIsIndeterminate] = useScopedLocalStorage(
    'verification-indeterminate',
    false
  );

  // Track if user is manually retrying (to prevent useEffect from overriding tab)
  const [isRetrying, setIsRetrying] = useState(false);

  const [selectedTab, setSelectedTab] = useState<VerificationTab>('terms');
  useEffect(() => {
    // Don't recalculate tab if user is manually retrying
    if (customer && !isRetrying) {
      // Calculate the selected tab based on the customer's status and the indeterminacy
      const selectedTab = calculateSelectedTab(customer, isIndeterminate);
      setSelectedTab(selectedTab);

      // If calculated tab is not indeterminate, remember in local storage
      if (selectedTab !== 'indeterminate') {
        setIsIndeterminate(false);
      }
    }
  }, [customer, isIndeterminate, setIsIndeterminate, isRetrying]);

  return (
    <VerificationTabs
      className={className}
      selectedTab={selectedTab}
      loading={isPending}
      tosUrl={customer?.tos_link ?? ''}
      kycUrl={customer?.kyc_link ?? ''}
      onComplete={() => {
        setIsIndeterminate(true);
        setIsRetrying(false); // Reset retry flag when user completes KYC
      }}
      onRetry={() => {
        setSelectedTab('details');
        setIsIndeterminate(false);
        setIsRetrying(true); // Set retry flag to prevent useEffect override
      }}
    />
  );
};

const calculateSelectedTab = (
  customer: BridgeCustomer,
  isIndeterminate: boolean
): VerificationTab => {
  // Degenerate case where there is no customer
  // This should never happen (unless it is right after the customer is created but before we have the customer create event)
  // TODO: Look into this
  if (!customer.customer) {
    return 'terms';
  }

  // TOS has to happen before anything else
  if (!customer.customer.has_accepted_terms_of_service) {
    return 'terms';
  }

  // If active. Check endorsements. If both are approved, return active, if sepa is not approved, return proof.
  if (customer.customer.status === 'active') {
    if (
      customer.customer.endorsements.find(
        (endorsement) => endorsement.name === 'sepa'
      )?.status === 'incomplete'
    ) {
      return 'proof';
    }
    return 'active';
  }

  // @ts-expect-error We expect some statuses to not be end states
  if (VERIFICATION_END_STATES.includes(customer.customer?.status)) {
    return customer.customer?.status as VerificationEndState;
  }

  if (isIndeterminate) {
    return 'indeterminate';
  }

  if (
    customer.customer?.endorsements.find(
      (endorsement) => endorsement.name === 'base'
    )?.status === 'incomplete'
  ) {
    return 'details';
  }

  return 'proof';
};
