'use client';

import { Chat } from './chat';
import { Message, userData } from './data';
import React, { useEffect, useState } from 'react';

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  handlewNewMessage?: (newMessage: Message) => void;
}

export function ChatLayoutMinimal({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  handlewNewMessage,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(userData[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener('resize', checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  return (
    <Chat
      messages={[]}
      selectedUser={selectedUser}
      handlewNewMessage={handlewNewMessage}
      isMobile={isMobile}
      showTopbar={false}
    />
  );
}
