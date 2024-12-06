import { Link03 } from '@untitled-ui/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { isValidUrl, normalizeUrl } from '@/components/profile/widgets/util';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AddLinkProps {
  initialValue: string;
  onSubmit: (link: string) => void;
  isAddLinkOpen: boolean;
  setIsAddLinkOpen: (open: boolean) => void; // Prop for managing popover state
}

export const AddLink = ({
  initialValue,
  setIsAddLinkOpen,
  isAddLinkOpen,
  onSubmit,
}: AddLinkProps) => {
  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [isAddLinkOpen, initialValue]);

  /** Necessary to not conflict with widget redirects */
  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  /** Handles case when user confirms their inputted link */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Check if user is essentially removing link
      if (value.trim() === '') {
        setIsAddLinkOpen(false);
        setIsValid(true);
        onSubmit('');
        return;
      }
      const normalizedUrl = normalizeUrl(value);
      // make sure it's a legitimate link
      if (!isValidUrl(value) || !normalizedUrl) {
        setIsValid(false);
        toast('Invalid Link', {
          description:
            'Double check the URL you entered redirects to a legitimate website.',
        });
        return;
      } else {
        // otherwise, update widget's link
        onSubmit(normalizedUrl);
        setIsAddLinkOpen(false);
        setIsValid(true);
      }
    }
  };

  return (
    <Popover
      open={isAddLinkOpen}
      onOpenChange={(open: boolean) => setIsAddLinkOpen(open)}
    >
      <PopoverTrigger asChild>
        <div onClick={handleIconClick}>
          {initialValue ? (
            <Image
              src='/svg/link-check.svg'
              alt='link check'
              width={19}
              height={19}
              className={isAddLinkOpen ? 'invert' : ''}
            />
          ) : (
            <Link03
              color={isAddLinkOpen ? 'black' : 'white'}
              height={20}
              width={20}
              strokeWidth={2.5}
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={16}
        align='center' // Change alignment to start to shift the popover to the right
        data-align='center'
        className='ml-20 w-[170px] rounded-xl border-0 bg-[rgba(34,36,35,1)] p-1.5'
      >
        <Input
          type='text'
          value={value}
          onChange={(e) => {
            // Reset validity state when input changes
            setValue(e.target.value);
            setIsValid(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder='Enter link here'
          variant='noRing'
          className={cn(
            `h-7 w-full bg-[#344054] py-0.5 pl-1.5 text-sm text-gray-300`,
            isValid ? 'border-[rgba(34,36,35,1)]' : 'border-red-500' // Display invalidity
          )}
        />
      </PopoverContent>
    </Popover>
  );
};
