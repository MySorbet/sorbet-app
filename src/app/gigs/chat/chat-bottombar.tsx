import { FilePreview } from './chat-file-preview';
import { EmojiPicker } from './emoji-picker';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { FileMessage, SendMessageParams, TextMessage } from '@/types/sendbird';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  ThumbsUp,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

interface ChatBottombarProps {
  sendMessage: (newMessage: SendMessageParams) => void;
  isMobile: boolean;
  channel: GroupChannel | undefined | null;
  contractStatus: string;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  sendMessage,
  isMobile,
  channel,
  contractStatus,
}: ChatBottombarProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  const { toast } = useToast();

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const handleAddFile = async (event: any) => {
    // temporarily only allow one file to be uploaded because sb uses a different method for multiple files
    if (files.length === 1) {
      toast({ title: 'Only one file can be uploaded at a time.' });
      return;
    }
    setFiles((files) => [...files, event.target.files[0]]);
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const messageInputValue = event.target.value;
    setMessage(messageInputValue);

    if (messageInputValue !== '') {
      await channel?.startTyping();
    } else {
      await channel?.endTyping();
    }
  };

  const handleThumbsUp = () => {
    const params: TextMessage = {
      type: 'text',
      message: '👍',
    };
    sendMessage(params);
    setMessage('');
  };

  const handleSend = () => {
    if (message.length > 0) {
      if (message.trim()) {
        const params: TextMessage = {
          type: 'text',
          message: message.trim(),
        };
        sendMessage(params);
        setMessage('');

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } else {
      const params: FileMessage = {
        type: 'file',
        message: files,
      };
      sendMessage(params);
      setFiles([]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + '\n');
    }
  };

  useEffect(() => {
    if (
      contractStatus ===
      ('NotStarted' || 'InProgress' || 'InReview' || 'Completed' || 'Rejected')
    )
      setDisabled(false);
    else setDisabled(true);
  }, [contractStatus]);

  useEffect(() => {
    async function checkTypingForFiles() {
      if (files.length > 0) {
        await channel?.startTyping();
      } else {
        await channel?.endTyping();
      }
    }
    checkTypingForFiles();
  }, [files.length]);

  return (
    <div className='p-2 flex justify-between w-full items-center gap-2'>
      <div className='flex'>
        <Popover>
          <PopoverTrigger asChild>
            <Link
              href='#'
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-9 w-9',
                'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
              )}
            >
              <PlusCircle size={20} className='text-muted-foreground' />
            </Link>
          </PopoverTrigger>
          <PopoverContent side='top' className='w-full p-2'>
            {message.trim() || isMobile ? (
              <div className='flex gap-2'>
                <Link
                  href='#'
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'h-9 w-9',
                    'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                  )}
                >
                  <Mic size={20} className='text-muted-foreground' />
                </Link>
                <Link
                  href='#'
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'h-9 w-9',
                    'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                  )}
                >
                  <FileImage size={20} className='text-muted-foreground' />
                </Link>
                <Link
                  href='#'
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'h-9 w-9',
                    'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                  )}
                >
                  <Paperclip size={20} className='text-muted-foreground' />
                </Link>
              </div>
            ) : (
              <Link
                href='#'
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  'h-9 w-9',
                  'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                )}
              >
                <Mic size={20} className='text-muted-foreground' />
              </Link>
            )}
          </PopoverContent>
        </Popover>
        {!message.trim() && !isMobile && (
          <div className='flex'>
            <div
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-9 w-9',
                'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
              )}
            >
              <Input
                type='file'
                className='hidden'
                ref={fileInputRef}
                onChange={handleAddFile}
              />
              <FileImage
                size={20}
                className='text-muted-foreground hover:cursor-pointer hover:text-foreground transition'
                onClick={handleFileClick}
              />
            </div>
            <Link
              href='#'
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-9 w-9',
                'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
              )}
            >
              <Paperclip size={20} className='text-muted-foreground' />
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key='input'
          className='w-full relative'
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: 'spring',
              bounce: 0.15,
            },
          }}
        >
          <div className='flex items-center'>
            <div className='w-full border rounded-full flex resize-none overflow-hidden bg-background'>
              {files.length > 0 ? (
                <div className='flex gap-1 my-2 pl-4'>
                  {files.map((file: File, index: number) => (
                    <FilePreview
                      key={index}
                      file={URL.createObjectURL(file)}
                      removeFile={() =>
                        setFiles((files) => {
                          const newFiles = files.filter(
                            (current: File) => current.name !== file.name
                          );
                          return newFiles;
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <Textarea
                  disabled={disabled}
                  autoComplete='off'
                  value={message}
                  ref={inputRef}
                  onKeyDown={handleKeyPress}
                  onChange={handleInputChange}
                  name='message'
                  placeholder='Aa'
                  className=' border-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 h-9'
                ></Textarea>
              )}
            </div>

            <div className='absolute right-4 top-3'>
              <EmojiPicker
                onChange={(value) => {
                  setMessage(message + value);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              />
            </div>
          </div>
        </motion.div>

        {message.trim() || files.length ? (
          <Link
            href='#'
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'h-9 w-9',
              'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0'
            )}
            onClick={handleSend}
          >
            <SendHorizontal size={20} className='text-muted-foreground' />
          </Link>
        ) : (
          <Link
            href='#'
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'h-9 w-9',
              'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0'
            )}
            onClick={handleThumbsUp}
          >
            <ThumbsUp
              size={20}
              className='text-muted-foreground hover:text-foreground transition'
            />
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
}
