import { FileDisplay } from './chat-file-display';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { SBMessage } from '@/types/sendbird';
import {
  convertMilitaryToRegular,
  formatBytes,
  getTimeDifferenceInMinutes,
} from '@/utils/sendbird';
import { Member } from '@sendbird/chat/groupChannel';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef } from 'react';

interface ChatListProps {
  messages?: SBMessage[];
  selectedUser: User;
  typingMembers: Member[];
}

export function ChatList({
  messages,
  selectedUser,
  typingMembers,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, typingMembers.length]);

  return (
    <div className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
      <div
        ref={messagesContainerRef}
        className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'
      >
        <AnimatePresence>
          {messages?.map((message, index) => {
            const time = convertMilitaryToRegular(
              message?.timestampData?.hour,
              message?.timestampData?.minute
            );
            return (
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
                    duration: 0.5,
                  },
                }}
                style={{
                  originX: 0.5,
                  originY: 0.5,
                }}
                className={cn(
                  'flex flex-col whitespace-pre-wrap',
                  'items-start'
                )}
              >
                <div className='flex flex-col gap-1 items-start w-full'>
                  {index === 0 && (
                    <div className='flex items-center gap-1 mt-5'>
                      <Avatar className='flex justify-center items-center'>
                        <AvatarImage
                          src={message.avatar ? message.avatar : '/avatar.svg'}
                          alt={message.nickname}
                          width={6}
                          height={6}
                        />
                        <AvatarFallback>{message.nickname[0]}</AvatarFallback>
                      </Avatar>
                      <span className='text-base'>{message.nickname}</span>
                      <span className='text-sm'>{time}</span>
                    </div>
                  )}
                  {index > 0 &&
                    getTimeDifferenceInMinutes(
                      `${message?.timestampData?.hour}:${message?.timestampData?.minute}`,
                      `${messages[index - 1]?.timestampData?.hour}:${
                        messages[index - 1]?.timestampData?.minute
                      }`
                    ) > 60 && (
                      <div className='flex w-full justify-center text-gray-500'>
                        {time}
                      </div>
                    )}
                  {index > 0 &&
                    messages[index - 1].userId !== message.userId && (
                      <div className='flex items-center gap-1 mt-5'>
                        <Avatar className='flex justify-center items-center'>
                          <AvatarImage
                            src={
                              message.avatar ? message.avatar : '/avatar.svg'
                            }
                            alt={message.nickname}
                            width={6}
                            height={6}
                          />
                          <AvatarFallback>{message.nickname[0]}</AvatarFallback>
                        </Avatar>
                        <span className='text-base'>{message.nickname}</span>
                        <span className='text-sm'>{time}</span>
                      </div>
                    )}
                </div>
                {!message.fileData?.sendbirdUrl ? (
                  <span
                    className={cn(
                      'bg-accent p-2 px-3  ml-8 rounded-2xl max-w-xs mt-1 font-light',
                      `${
                        message.userId === selectedUser.id
                          ? 'bg-sorbet text-white'
                          : 'bg-[#D7D7D7]'
                      }`
                    )}
                  >
                    {message.message}
                  </span>
                ) : (
                  <div className='ml-8 mt-1 flex gap-2 items-center'>
                    <FileDisplay
                      file={message.fileData}
                      color={
                        message.userId === selectedUser.id
                          ? 'bg-sorbet text-white'
                          : 'bg-[#D7D7D7]'
                      }
                    />
                    <span>
                      {message.fileData.name}{' '}
                      <span className='text-xs'>
                        {formatBytes(message.fileData.size)}
                      </span>
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {typingMembers.length > 0 && (
          <div className='flex flex-col gap-1'>
            {messages &&
              messages[messages.length - 1]?.userId !==
                typingMembers[0].userId && (
                <div className='flex items-center gap-1 mt-5'>
                  <Avatar className='flex justify-center items-center'>
                    <AvatarImage
                      src={
                        typingMembers[0].profileUrl
                          ? typingMembers[0].profileUrl
                          : '/avatar.svg'
                      }
                      alt={typingMembers[0].nickname}
                      width={6}
                      height={6}
                    />
                    <AvatarFallback>
                      {typingMembers[0].nickname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-base'>{typingMembers[0].nickname}</span>
                </div>
              )}

            <div className='flex items-center justify-center py-2 bg-[#D7D7D7]  ml-8 rounded-2xl mt-1 w-16'>
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
