import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type Duration = '3' | '7' | '30'; // | 'all';

/** Map of duration to display string */
export const displayDuration: Record<Duration, string> = {
  '3': 'Last 3 Days',
  '7': 'Last 7 Days',
  '30': 'Last 30 Days',
  // all: 'All Time',
};

interface SelectDurationProps {
  selectedValue: Duration;
  onChange: (value: Duration) => void;
  disabled?: boolean;
}

export const SelectDuration: React.FC<SelectDurationProps> = ({
  selectedValue,
  onChange,
  disabled,
}) => {
  return (
    <Select value={selectedValue} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className='border-border w-[140px] border font-medium'>
        <SelectValue placeholder='Select Duration' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='3'>{displayDuration['3']}</SelectItem>
          <SelectItem value='7'>{displayDuration['7']}</SelectItem>
          <SelectItem value='30'>{displayDuration['30']}</SelectItem>
          {/* <SelectItem value='all'>{displayDuration['all']}</SelectItem> */}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
