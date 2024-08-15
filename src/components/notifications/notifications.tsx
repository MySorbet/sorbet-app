import './notifications.css';

import {
  KnockFeedProvider,
  NotificationFeedPopover,
  NotificationIconButton,
} from '@knocklabs/react';
import React, { useRef, useState } from 'react';

import { NotificationToasts } from '@/components/notifications';

export const Notifications = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);

  return (
    <div className='cursor-pointer'>
      <KnockFeedProvider
        feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID || ''}
      >
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
  );
};
