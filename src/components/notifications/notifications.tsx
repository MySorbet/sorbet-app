import './notifications.css';

import {
  KnockFeedProvider,
  KnockProvider,
  NotificationFeedPopover,
  NotificationIconButton,
} from '@knocklabs/react';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

import { NotificationToasts } from '@/components/notifications';
import { useAuth } from '@/hooks';
import { env } from '@/lib/env';

export const Notifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();

  // No user, no notifications
  if (!user) {
    return null;
  }

  return (
    <KnockProvider
      apiKey={env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
      userId={user.id}
    >
      <div className='cursor-pointer'>
        <KnockFeedProvider feedId={env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID}>
          <NotificationIconButton
            ref={buttonRef}
            onClick={() => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={buttonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
            // TODO: Redirect to appropriate route based on 'item' data.
            // TODO: The identifier would come from the backend, ideally relating to how we put state in the url
            // TODO: i.e: if we put contract id in the url, the backend would populate the 'data' prop with the contract id
            // For now, it is a simple redirect to 'gigs' page. As we have that more solidified, we can then have more detailed/specific redirects
            onNotificationClick={(item) => {
              console.log('item from onNotificationClick', item.data);
              // TODO: look into why this works bc this isn't a client component at the moment
              router.push('/gigs');
            }}
          />
          <NotificationToasts />
        </KnockFeedProvider>
      </div>
    </KnockProvider>
  );
};
