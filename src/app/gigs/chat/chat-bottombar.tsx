import { GroupChannel } from '@sendbird/chat/groupChannel';
import {
  ArrowNarrowUp,
  Bold01,
  Italic01,
  Link03,
  List,
} from '@untitled-ui/icons-react';
import { ListOrdered } from 'lucide-react';
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  FileMessage,
  SendMessageParams,
  SupportedFileIcons,
  TextMessage,
} from '@/types/sendbird';

import { FilePreview } from './chat-file-preview';
import { EmojiPicker } from './emoji-picker';

interface ChatBottombarProps {
  sendMessage: (newMessage: SendMessageParams) => void;
  isMobile: boolean;
  channel: GroupChannel | undefined | null;
  contractStatus: string;
  supportedIcons: SupportedFileIcons;
}

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
  const test = 'test';
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
      {files.length > 0 ? (
        <div className='my-2 flex gap-1'>
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
          placeholder='Type your message...'
          className='text-foreground w-full resize-none overflow-hidden border-none bg-transparent pl-0 text-base font-normal placeholder:italic placeholder:text-[#95949C] focus-visible:ring-transparent'
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          value={message}
        />
      )}
      <ChatActions
        inputRef={inputRef}
        setMessage={setMessage}
        message={message}
        disabled={disabled}
        handleSend={handleSend}
        fileInputRef={fileInputRef}
        handleAddFile={handleAddFile}
        supportedIcons={supportedIcons}
        handleFileClick={handleFileClick}
      />
    </div>
  );
}

interface ChatActionsProps {
  setMessage: Dispatch<SetStateAction<string>>;
  inputRef: RefObject<HTMLTextAreaElement>;
  message: string;
  disabled: boolean;
  handleSend: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  // eslint-disable-next-line no-unused-vars
  handleAddFile: (event: any) => void;
  supportedIcons: SupportedFileIcons;
  handleFileClick: () => void;
}

const ChatActionStyles =
  'h-4 w-4 text-[#D9D9D9] hover:text-muted-foreground transition hover:cursor-pointer';

const ChatActions = ({
  setMessage,
  inputRef,
  message,
  disabled,
  handleSend,
  fileInputRef,
  handleAddFile,
  handleFileClick,
  supportedIcons,
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
          className='hover:text-muted-foreground h-4 w-4 text-[#D9D9D9]'
        />
        <div className='divider h-4 w-[1px] bg-[#F2F2F2]' />
        <div>
          <Input
            type='file'
            className='hidden'
            ref={fileInputRef}
            onChange={handleAddFile}
            accept={Object.keys(supportedIcons)
              .map((type: string) => '.' + type)
              .join(',')}
          />
          <Link03 className={ChatActionStyles} onClick={handleFileClick} />
        </div>
        {/* // ! These are currently unsupported */}
        {/* <Bold01 className={ChatActionStyles} />
        <Italic01 className={ChatActionStyles} />
        <List className={ChatActionStyles} />
        <ListOrdered className={ChatActionStyles} /> */}
      </div>
      <button
        className='bg-sorbet disabled:bg-sorbet/20 group flex h-8 w-8 items-center justify-center rounded-xl border-none'
        disabled={disabled}
        onClick={handleSend}
      >
        <ArrowNarrowUp className='h-4 w-4 text-white transition ease-out group-hover:translate-y-[-1px]' />
      </button>
    </div>
  );
};
