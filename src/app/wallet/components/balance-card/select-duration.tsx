import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type Duration = '3' | '7' | '30' | 'all';

interface SelectDurationProps {
  selectedValue: Duration;
  onChange: (value: Duration) => void;
}

export const SelectDuration: React.FC<SelectDurationProps> = ({
  selectedValue,
  onChange,
}) => {
  return (
    <Select value={selectedValue} onValueChange={onChange}>
      <SelectTrigger className='border-border w-[140px] border font-medium'>
        <SelectValue placeholder='Select Duration' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='3'>Last 3 Days</SelectItem>
          <SelectItem value='7'>Last 7 Days</SelectItem>
          <SelectItem value='30'>Last 30 Days</SelectItem>
          <SelectItem value='all'>All Time</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
