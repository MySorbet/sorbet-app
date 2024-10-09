import BaseMessage from '@sendbird/chat';
import type { Member } from '@sendbird/chat/groupChannel';
import { useGroupChannelContext } from '@sendbird/uikit-react/GroupChannel/context';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

import { ChatSkeleton } from '@/app/gigs/chat/chat-skeleton';
import { MessageAvatar } from '@/app/gigs/chat/message-avatar';
import {
  convertMilitaryToRegular,
  createChatTimestamp,
  getTimeDifferenceInMinutes,
  timestampToTime,
} from '@/app/gigs/chat/sendbird-utils';
import { cn } from '@/lib/utils';
import { SupportedFileIcons } from '@/types/sendbird';

import { FileDisplay } from './chat-file-display';
import { TypingIndicator } from './typing-indicator';

interface ChatListProps {
  loggedInUserId: string;
  typingMembers: Member[];
  supportedIcons: SupportedFileIcons;
  chatLoading: boolean;
}

/**
 * This type serves to bridge the gap btw the React SDK v3 and the JS SDK v4
 * React SDK BaseMessage type is missing some properties
 */
interface BaseMessageWithSender extends BaseMessage {
  sender: { userId: string; nickname: string; plainProfileUrl: string };
  createdAt: number;
  messageType: string;
  name: string;
  size: string;
  plainUrl: string;
  type: string;
}

export function ChatList({
  loggedInUserId,
  typingMembers,
  supportedIcons,
  chatLoading,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const ctx = useGroupChannelContext();
  const messages = ctx.messages as unknown as BaseMessageWithSender[];

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
              {messages.map((message, index) => {
                const { year, month, day, hour, minute, second } =
                  timestampToTime(message.createdAt);

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
                    messages[index - 1].sender.userId !== message.sender.userId;
                }
                /**
                 * Shows the time between the current message and the previous message if the time difference is greater than an hour
                 */
                const { hour: prevHour, minute: prevMinute } = timestampToTime(
                  messages[index - 1]?.createdAt ?? ''
                );

                const isTimeDifferenceGreaterThanHour =
                  getTimeDifferenceInMinutes(
                    `${hour}:${minute}`,
                    `${prevHour}:${prevMinute}`
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
                          avatar={message?.sender.plainProfileUrl}
                          nickname={message?.sender.nickname}
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
                          avatar={message?.sender.plainProfileUrl}
                          nickname={message?.sender.nickname}
                          time={messageTime}
                        />
                      )}
                    </div>
                    {message.messageType !== 'file' ? (
                      <span
                        className={cn(
                          'bg-accent ml-8 mt-1  max-w-xs rounded-2xl p-2 px-3 font-light',
                          `${
                            message.sender.userId === loggedInUserId
                              ? 'bg-sorbet text-white'
                              : 'bg-[#D7D7D7]'
                          }`
                        )}
                      >
                        {message.message as unknown as string}
                      </span>
                    ) : (
                      <div className='ml-8 mt-1 flex items-center gap-2'>
                        <FileDisplay
                          fileName={message.name}
                          fileSize={Number(message.size)}
                          file={{
                            name: message.name,
                            sendbirdUrl: message.plainUrl,
                            type: message.type,
                            size: Number(message.size),
                          }}
                          supportedIcons={supportedIcons}
                          color={
                            message.sender.userId === loggedInUserId
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
                  messages[messages.length - 1]?.sender.userId !==
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
