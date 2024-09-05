import type { Member } from '@sendbird/chat/groupChannel';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { ChatSkeleton } from '@/app/gigs/chat/chat-skeleton';
import { MessageAvatar } from '@/app/gigs/chat/message-avatar';
import {
  convertMilitaryToRegular,
  createChatTimestamp,
  getTimeDifferenceInMinutes,
} from '@/app/gigs/chat/sendbird-utils';
import { cn } from '@/lib/utils';
import { UserWithId } from '@/types';
import { SBMessage, SupportedFileIcons } from '@/types/sendbird';

import { FileDisplay } from './chat-file-display';
import { TypingIndicator } from './typing-indicator';

interface ChatListProps {
  messages: SBMessage[];
  selectedUser: UserWithId;
  typingMembers: Member[];
  supportedIcons: SupportedFileIcons;
  chatLoading: boolean;
}

export function ChatList({
  messages,
  selectedUser,
  typingMembers,
  supportedIcons,
  chatLoading,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, typingMembers.length]);

  return (
    <div className='flex h-[50vh] w-full flex-grow-0 flex-col overflow-x-hidden overflow-y-hidden'>
      {chatLoading ? (
        <ChatSkeleton />
      ) : (
        <>
          <div
            ref={messagesContainerRef}
            className='flex h-full w-full flex-col overflow-y-auto overflow-x-hidden pb-1 '
          >
            <AnimatePresence>
              {messages?.map((message, index) => {
                const { year, month, day, hour, minute, second } =
                  message.timestampData!;

                /**
                 * Renders the time (it's centered horizontally) in between messages when there is a large time gap between messages
                 */
                const chatTime = createChatTimestamp({
                  year,
                  month,
                  day,
                  hour,
                  minute,
                  second,
                });

                /**
                 * Renders time specific to when each message was sent
                 */
                const messageTime = convertMilitaryToRegular(hour, minute);

                /**
                 * Checks if the previous message was sent by the current user or the other user
                 */
                let isPreviousMessageSameUser: boolean | undefined;
                if (index > 0) {
                  isPreviousMessageSameUser =
                    messages[index - 1].userId !== message.userId;
                }
                /**
                 * Shows the time between the current message and the previous message if the time difference is greater than an hour
                 */
                const isTimeDifferenceGreaterThanHour =
                  getTimeDifferenceInMinutes(
                    `${message?.timestampData?.hour}:${message?.timestampData?.minute}`,
                    `${messages[index - 1]?.timestampData?.hour}:${
                      messages[index - 1]?.timestampData?.minute
                    }`
                  ) > 60;
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
                    <div className='flex w-full flex-col items-start gap-1'>
                      {index === 0 && (
                        <MessageAvatar
                          avatar={message?.avatar}
                          nickname={message?.nickname}
                          time={messageTime}
                        />
                      )}
                      {index > 0 && isTimeDifferenceGreaterThanHour && (
                        <div className='mt-4 flex w-full justify-center text-gray-500'>
                          {chatTime}
                        </div>
                      )}
                      {index > 0 && isPreviousMessageSameUser && (
                        <MessageAvatar
                          avatar={message?.avatar}
                          nickname={message?.nickname}
                          time={messageTime}
                        />
                      )}
                    </div>
                    {!message.fileData?.sendbirdUrl ? (
                      <span
                        className={cn(
                          'bg-accent ml-8 mt-1  max-w-xs rounded-2xl p-2 px-3 font-light',
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
                      <div className='ml-8 mt-1 flex items-center gap-2'>
                        <FileDisplay
                          fileName={message.fileData.name}
                          fileSize={message.fileData.size}
                          file={message.fileData}
                          supportedIcons={supportedIcons}
                          color={
                            message.userId === selectedUser.id
                              ? 'bg-sorbet text-white'
                              : 'bg-[#D7D7D7]'
                          }
                        />
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
                    <MessageAvatar
                      avatar={typingMembers[0].profileUrl}
                      nickname={typingMembers[0].nickname}
                    />
                  )}
                <div className='ml-8 mt-1 flex w-16 items-center  justify-center rounded-2xl bg-[#D7D7D7] py-2'>
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
