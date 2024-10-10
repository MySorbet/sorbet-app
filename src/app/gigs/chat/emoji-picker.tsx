'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { SmileIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface EmojiPickerProps {
  onChange: (value: string) => void;
  /** This affects the styling of the SmileIcon */
  className?: string;
}

export const EmojiPicker = ({ onChange, className }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon
          className={cn(
            'text-muted-foreground hover:text-foreground h-5 w-5 transition',
            className
          )}
        />
      </PopoverTrigger>
      <PopoverContent className='w-full'>
        <Picker
          emojiSize={18}
          theme='light'
          data={data}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
