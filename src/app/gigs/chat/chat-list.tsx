import { FileDisplay } from './chat-file-display';
import {
  convertMilitaryToRegular,
  formatBytes,
  getTimeDifferenceInMinutes,
} from './sendbird';
import { TypingIndicator } from './typing-indicator';
import { MessageAvatar } from '@/app/gigs/chat/message-avatar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ContractStatus, User } from '@/types';
import { SBMessage, SupportedFileIcons } from '@/types/sendbird';
import { Member } from '@sendbird/chat/groupChannel';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquareWarning } from 'lucide-react';
import React, { useRef } from 'react';

interface ChatListProps {
  messages?: SBMessage[];
  selectedUser: User;
  typingMembers: Member[];
  contractStatus: string;
  supportedIcons: SupportedFileIcons;
}

export function ChatList({
  messages,
  selectedUser,
  typingMembers,
  contractStatus,
  supportedIcons,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, typingMembers.length]);

  return (
    <div className='w-full overflow-y-hidden overflow-x-hidden h-[50vh] flex flex-col flex-grow-0'>
      {contractStatus === 'PendingApproval' && (
        <div className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-row items-center justify-center gap-3'>
          <MessageSquareWarning className='w-10 h-10' />
          <span className='text-2xl'>
            Approve the contract to start chatting
          </span>
        </div>
      )}
      {contractStatus ===
        ('NotStarted' ||
          'InProgress' ||
          'InReview' ||
          'Completed' ||
          'Rejected') && (
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
                      <MessageAvatar
                        avatar={message?.avatar}
                        nickname={message?.nickname}
                        time={time}
                      />
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
                        <MessageAvatar
                          avatar={message?.avatar}
                          nickname={message?.nickname}
                          time={time}
                        />
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
              <div className='flex items-center justify-center py-2 bg-[#D7D7D7]  ml-8 rounded-2xl mt-1 w-16'>
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
