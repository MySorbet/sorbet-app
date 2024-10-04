import { GroupChannel } from '@sendbird/chat/groupChannel';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileImage,
  ListOrdered,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  ThumbsUp,
} from 'lucide-react';
import Link from 'next/link';
import React, {
  Dispatch,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

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
import {
  FileMessage,
  SendMessageParams,
  SupportedFileIcon,
  SupportedFileIcons,
  TextMessage,
} from '@/types/sendbird';

import { FilePreview } from './chat-file-preview';
import { EmojiPicker } from './emoji-picker';
import {
  ArrowNarrowUp,
  Bold01,
  Italic01,
  Link03,
  List,
} from '@untitled-ui/icons-react';

interface ChatBottombarProps {
  sendMessage: (newMessage: SendMessageParams) => void;
  isMobile: boolean;
  channel: GroupChannel | undefined | null;
  contractStatus: string;
  supportedIcons: SupportedFileIcons;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  sendMessage,
  isMobile,
  channel,
  contractStatus,
  supportedIcons,
}: ChatBottombarProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  const { toast } = useToast();

  //TODO: Refactor funcs that use send message to use optimistic updates

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
    //TODO: Figure out when chat becomes read only and sync the input with that disabled state
    if (contractStatus === 'Completed') {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
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
    <div className='flex flex-col rounded-lg border border-[#D7D7D7] bg-white py-2 pl-4 pr-2 shadow-sm'>
      <Textarea
        placeholder='Type your message...'
        className='text-foreground w-full resize-none overflow-hidden border-none bg-transparent pl-0 text-base font-normal placeholder:italic placeholder:text-[#95949C] focus-visible:ring-transparent'
      />
      <ChatActions
        inputRef={inputRef}
        setMessage={setMessage}
        message={message}
        disabled={true}
      />
    </div>
  );
}

interface ChatActionsProps {
  setMessage: Dispatch<SetStateAction<string>>;
  inputRef: any;
  message: string;
  disabled: boolean;
}

const ChatActionStyles =
  'h-4 w-4 text-[#D9D9D9] hover:text-muted-foreground transition hover:cursor-pointer';

const ChatActions = ({
  setMessage,
  inputRef,
  message,
  disabled,
}: ChatActionsProps) => {
  return (
    <div className='flex max-h-full items-center justify-between'>
      <div className='flex gap-3'>
        <EmojiPicker
          onChange={(value) => {
            setMessage(message + value);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        />
        <div className='divider h-4 w-[1px] bg-[#F2F2F2]' />
        <Link03 className={ChatActionStyles} />
        <Bold01 className={ChatActionStyles} />
        <Italic01 className={ChatActionStyles} />
        <List className={ChatActionStyles} />
        <ListOrdered className={ChatActionStyles} />
      </div>
      <button
        className='bg-sorbet disabled:bg-sorbet/20 flex h-8 w-8 items-center justify-center rounded-xl border-none'
        disabled={disabled}
      >
        <ArrowNarrowUp className='h-4 w-4 text-white' />
      </button>
    </div>
  );
};
