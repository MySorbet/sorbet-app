'use client';

import { useKnockFeed } from '@knocklabs/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { useToast } from '@/components/ui/use-toast';

const KnockContractWorkflows = new Set([
  'contract-finished',
  'contract-proposal-accepted',
  'contract-proposal-rejected',
  'contract-proposed',
  'milestone-approved',
  'milestone-funded',
  'milestone-submitted',
  'offer',
  'offer-accepted',
  'offer-rejected',
]);

const NotificationToasts = () => {
  const { feedClient } = useKnockFeed();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onNotificationsReceived = useCallback(
    ({ items }: any) => {
      // Whenever we receive a new notification from our real-time stream, show a toast
      // (note here that we can receive > 1 items in a batch)
      items.forEach((notification: any) => {
        console.log('from onNotificationsReceived ', notification);
        if (notification.data.showToast === false) return;
        if (KnockContractWorkflows.has(notification.data.type)) {
          // Invalidating both because they are not mutually exclusive
          queryClient.invalidateQueries({
            queryKey: ['contractForOffer'],
          });
          queryClient.invalidateQueries({ queryKey: ['offers'] });
        }
        toast({
          title:
            notification.data.title != ''
              ? notification.data.title
              : 'Notification',
          description: (
            <div
              dangerouslySetInnerHTML={{
                __html: notification.blocks[0].rendered,
              }}
            />
          ),
        });
      });
    },
    [queryClient, toast]
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
