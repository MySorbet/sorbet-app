import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link03 } from '@untitled-ui/icons-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { isValidUrl } from '@/components/profile/widgets/util';

interface AddLinkProps {
  value: string;
  onChange: (value: string) => void;
  onSubmission: () => void;
  popoverOpen: boolean;
  setPopoverOpen: (open: boolean) => void; // Prop for managing popover state
}

export const AddLink = ({
  value,
  onChange,
  setPopoverOpen,
  popoverOpen,
  onSubmission,
}: AddLinkProps) => {
  const [isValid, setIsValid] = useState(true); // State to track validity

  const { toast } = useToast();

  /** Necessary to not conflict with widget redirects */
  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  /** Handles case when user confirms their inputted link */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Check if the input is valid and do any error-checking
      if (value.trim() === '' || !isValidUrl(value)) {
        setIsValid(false);
        toast({
          title: 'Invalid Link',
          description:
            'Double check the URL you entered redirects to a legitimate website.',
        });
        return;
      }
      // otherwise, update widget's link
      setPopoverOpen(false);
      setIsValid(true);
      onSubmission();
    }
  };

  return (
    <Popover open={popoverOpen} onOpenChange={(open) => setPopoverOpen(open)}>
      <PopoverTrigger asChild>
        <div onClick={handleIconClick}>
          <Link03
            color={popoverOpen ? 'black' : 'white'}
            height={20}
            width={20}
            strokeWidth={2.5}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-full rounded-lg bg-[rgba(34,36,35,1)] p-2'>
        <Input
          type='text'
          value={value}
          onChange={(e) => {
            // Reset validity state when input changes
            onChange(e.target.value);
            setIsValid(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder='Enter link'
          noRing={true}
          className={`border ${
            isValid ? 'border-[rgba(34,36,35,1)]' : 'border-red-500' // Display invalidity
          } bg-[#344054] text-gray-300 focus:ring-0 focus:ring-[rgba(34,36,35,1)] focus:ring-offset-0`}
        />
      </PopoverContent>
    </Popover>
  );
};
