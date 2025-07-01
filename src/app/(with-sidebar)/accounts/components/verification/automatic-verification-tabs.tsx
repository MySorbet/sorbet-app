import { useEffect, useState } from 'react';

import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { BridgeCustomer } from '@/types/bridge';

import { VerificationTab, VerificationTabs } from './verification-tabs';

/**
 * Fetch the bridge customer and calculate the selected tab based on the customer's status.
 *
 * The selected tab is then passed to the `VerificationTabs` component.
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

const calculateSelectedTab = (customer: BridgeCustomer) => {
  console.log(customer);
  if (!customer.customer?.has_accepted_terms_of_service) {
    return 'terms';
  }

  // TODO: Handle exotic statuses
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
