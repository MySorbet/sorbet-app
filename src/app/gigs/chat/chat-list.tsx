import ChatBottombar from './chat-bottombar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { SBMessage } from '@/types/sendbird';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react';

interface ChatListProps {
  messages?: SBMessage[];
  selectedUser: User;
  sendMessage: (newMessage: SBMessage) => void;
  isMobile: boolean;
}

export function ChatList({
  messages,
  selectedUser,
  sendMessage,
  isMobile,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
      <div
        ref={messagesContainerRef}
        className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                'flex flex-col gap-2 p-2 whitespace-pre-wrap',
                message.userId === selectedUser.id ? 'items-end' : 'items-start'
              )}
            >
              <div className='flex gap-1 items-center'>
                {message.userId === selectedUser.id && (
                  <Avatar className='flex justify-center items-center'>
                    <AvatarImage
                      src={message.avatar ? message.avatar : '/avatar.svg'}
                      alt={message.nickname}
                      width={6}
                      height={6}
                    />
                    <AvatarFallback>{message.nickname[0]}</AvatarFallback>
                  </Avatar>
                )}
                <span
                  className={cn(
                    'bg-accent p-3 mr-3 rounded-3xl max-w-xs',
                    `${
                      message.userId === selectedUser.id
                        ? 'bg-sorbet text-white'
                        : 'bg-[#D7D7D7]'
                    }`
                  )}
                >
                  {message.message}
                </span>
                {message.userId !== selectedUser.id && (
                  <Avatar className='flex justify-center items-center'>
                    <AvatarImage
                      src={message.avatar}
                      alt={message.nickname}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className='mt-4'>
        <ChatBottombar
          sendMessage={sendMessage}
          isMobile={isMobile}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
}
