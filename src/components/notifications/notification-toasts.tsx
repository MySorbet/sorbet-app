import { useKnockFeed } from '@knocklabs/react';
import { useCallback, useEffect } from 'react';

import { useToast } from '@/components/ui/use-toast';

const NotificationToasts = () => {
  const { feedClient } = useKnockFeed();
  const { toast } = useToast();

  const onNotificationsReceived = useCallback(
    ({ items }: any) => {
      // Whenever we receive a new notification from our real-time stream, show a toast
      // (note here that we can receive > 1 items in a batch)
      items.forEach((notification: any) => {
        console.log(notification);
        if (notification.data.showToast === false) return;
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
    [feedClient, toast]
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
