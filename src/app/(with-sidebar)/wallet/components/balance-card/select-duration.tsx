import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type Duration = 'all' | '30' | '7' | '3';

/** Map of duration to display string */
export const displayDuration: Record<Duration, string> = {
  all: 'All time',
  '3': 'Last 3 Days',
  '7': 'Last 7 Days',
  '30': 'Last 30 Days',
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
      <SelectTrigger
        className='border-border w-[140px] border font-medium'
        aria-label='Select Duration'
      >
        <SelectValue aria-label='Select Duration' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='all'>{displayDuration['all']}</SelectItem>
          <SelectItem value='30'>{displayDuration['30']}</SelectItem>
          <SelectItem value='7'>{displayDuration['7']}</SelectItem>
          <SelectItem value='3'>{displayDuration['3']}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
