import { useEffect, useState } from 'react';

import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
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
 *
 * TODO: Add a pending state after KYC completion but before webhook update
 * TODO: Add a verification failed state
 * TODO: Under a verification "under review" state
 */
export const AutomaticVerificationTabs = () => {
  const { data: customer, isPending } = useBridgeCustomer();

  const [selectedTab, setSelectedTab] = useState<VerificationTab>('terms');
  useEffect(() => {
    if (customer) {
      setSelectedTab(calculateSelectedTab(customer));
    }
  }, [customer]);

  return <VerificationTabs selectedTab={selectedTab} loading={isPending} />;
};

const calculateSelectedTab = (customer: BridgeCustomer): VerificationTab => {
  // Degenerate case where there is no customer
  // This should never happen (unless it is right after the customer is created but before we have the customer create event)
  // TODO: Look into this
  if (!customer.customer) {
    return 'terms';
  }

  if (!customer.customer.has_accepted_terms_of_service) {
    return 'terms';
  }

  // @ts-expect-error We expect some statuses to not be end states
  if (VERIFICATION_END_STATES.includes(customer.customer?.status)) {
    return customer.customer?.status as VerificationEndState;
  }

  // TODO: Check for pending in local storage

  if (customer.customer?.status !== 'active') {
    return 'details';
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
