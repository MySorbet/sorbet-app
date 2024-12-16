import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { useLocalStorage } from '@/hooks';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useVerify } from '@/hooks/profile/use-verify';
import { BridgeCustomer } from '@/types';

import { openPollAndCallback } from './open-poll-and-callback';

// 40 seconds is about how long it takes for the backend to receive the kyc update webhook event
const INVALIDATE_BRIDGE_CUSTOMER_TIMEOUT = 40000;

/**
 * Hook for actions related to the verification card and its connection to bridge
 * See return for more details
 */
export const useBridgeActions = () => {
  const { data: bridgeCustomer } = useBridgeCustomer();

  // Build a function that will open a link in a new tab and invalidate the bridge customer query when it closes
  const queryClient = useQueryClient();
  const openAndInvalidate = (link: string) => {
    openPollAndCallback({
      link,
      onClose: () => {
        queryClient.invalidateQueries({ queryKey: ['bridgeCustomer'] });
      },
    });
  };

  // Persist the collapsed state of the verification card so that it stays collapsed
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    'isVerificationCollapsed',
    false
  );

  // Local state for optimistic loading state right after KYC tab is closed
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  const { mutate: verify, isPending: isVerifying } = useVerify({
    onSuccess: (data) => {
      openAndInvalidate((data as BridgeCustomer).tos_link);
    },
  });

  // Store a reference to the timeout so we can
  // clear it later in case the caller of this hook unmounts
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handlePrimaryButtonClick = () => {
    // If there is no bridge customer, we need to to kick off the verification process
    if (!bridgeCustomer) {
      verify();
      return;
    }

    // Try again (just re-open the KYC link. Does not include fancy timeout invalidation)
    // Note, there is not loading stat after tab close so this use case may be confusing
    if (bridgeCustomer.kyc_status === 'rejected') {
      openPollAndCallback({
        link: bridgeCustomer.kyc_link,
      });
      return;
    }

    // Close
    if (bridgeCustomer.kyc_status === 'approved') {
      setIsCollapsed(true);
      return;
    }

    // If the user has not accepted the terms of service,
    // open the terms of service link
    if (bridgeCustomer.tos_status !== 'approved') {
      openAndInvalidate(bridgeCustomer.tos_link);
    } else {
      // If the user has accepted the terms of service,
      // open the KYC link in a new tab. When the tab closes
      // setup a timeout to invalidate the bridge customer query after a delay
      openPollAndCallback({
        link: bridgeCustomer.kyc_link,
        onClose: () => {
          // Move to its own hook
          timeoutRef.current = setTimeout(() => {
            console.log('useBridgeActions: invalidating bridgeCustomer query');
            queryClient.invalidateQueries({
              queryKey: ['bridgeCustomer'],
            });
          }, INVALIDATE_BRIDGE_CUSTOMER_TIMEOUT);
          setIsIndeterminate(true);
        },
      });
    }
  };

  // Clear the timeout if the component calling this hook unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        console.log('useBridgeActions: clearing timeout due to unmount');
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    /** The fetched bridge customer */
    bridgeCustomer,
    /** true after verifyUser is called, but before the TOS link is opened */
    isVerifying,
    /** local state for optimistic loading state */
    isIndeterminate,
    /** local storage state for collapsed verification card. */
    isCollapsed,
    /** Handle a click on the verification card's primary button */
    handlePrimaryButtonClick,
  };
};
