'use client';

import { type FeedEventCallback } from '@knocklabs/client';
import { useKnockFeed } from '@knocklabs/react';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { useTransactionOverview } from '@/app/wallet/hooks/use-transaction-overview';
import { useWalletBalance } from '@/hooks/web3/use-wallet-balance';

const NotificationToasts = () => {
  const { feedClient } = useKnockFeed();
  const { refetch: refetchWalletBalance } = useWalletBalance();
  const { refetch: refetchTransactionOverview } = useTransactionOverview();

  // Whenever we receive a new notification from our real-time stream, show a toast
  // (note here that we can receive > 1 items in a batch)
  const onNotificationsReceived: FeedEventCallback = useCallback(
    ({ items }) => {
      items.forEach((notification) => {
        console.log('Notification received: ', notification);
        const key = notification.source.key;

        // Refresh the transaction overview and wallet balance when we receive a payment-received notification
        if (key === 'payment-received') {
          refetchTransactionOverview();
          refetchWalletBalance();
        }

        // Toast the notification (if the type was button set, we don't know what to do)
        if (
          notification.blocks[0].type === 'markdown' ||
          notification.blocks[0].type === 'text'
        ) {
          toast(
            <div
              dangerouslySetInnerHTML={{
                __html: notification.blocks[0].rendered,
              }}
            />
          );
        } else {
          console.error(
            'Unsupported notification type: ',
            notification.blocks[0].type
          );
        }
      });
    },
    [refetchTransactionOverview, refetchWalletBalance]
  );

  useEffect(() => {
    // Receive all real-time notifications on our feed
    feedClient.on('items.received.realtime', onNotificationsReceived);

    // Cleanup
    return () =>
      feedClient.off('items.received.realtime', onNotificationsReceived);
  }, [feedClient, onNotificationsReceived]);

  return null;
};

export { NotificationToasts };
