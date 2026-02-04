import { useBridgeCustomer } from './use-bridge-customer';
import { useDueCustomer } from './use-due-customer';

/**
 * Hook to determine if a user needs to migrate from Bridge to Due verification.
 * Returns true if:
 * - User is verified on Bridge (status === 'active')
 * - User is NOT verified on Due (status !== 'passed' and !== 'approved')
 */
export const useNeedsMigration = () => {
  const { data: bridgeCustomer } = useBridgeCustomer();
  const { data: dueCustomer } = useDueCustomer();

  // Check if user is verified on Bridge
  const isBridgeVerified = bridgeCustomer?.customer?.status === 'active';

  // Check if user is verified on Due
  const isDueVerified =
    dueCustomer?.account?.kyc?.status === 'passed' ||
    dueCustomer?.account?.kyc?.status === 'approved';

  // User needs migration if they're Bridge verified but not Due verified
  return isBridgeVerified && !isDueVerified;
};
