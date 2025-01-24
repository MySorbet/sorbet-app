import './notifications.css';

import {
  KnockFeedProvider,
  KnockProvider,
  NotificationFeedPopover,
  NotificationIconButton,
} from '@knocklabs/react';
import React, { useRef, useState } from 'react';

import { NotificationToasts } from '@/components/notifications';
import { useAuth } from '@/hooks';
import { env } from '@/lib/env';

export const Notifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  const { user } = useAuth();

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
          />
          <NotificationToasts />
        </KnockFeedProvider>
      </div>
    </KnockProvider>
  );
};
