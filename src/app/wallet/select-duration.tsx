import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectDurationProps {
  selectedValue: string;
  onChange: (value: string) => void;
}

export const SelectDuration: React.FC<SelectDurationProps> = ({
  selectedValue,
  onChange,
}) => {
  return (
    <Select defaultValue={selectedValue} onValueChange={onChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='Select Duration' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='30'>Last 30 Days</SelectItem>
          <SelectItem value='7'>Last 7 Days</SelectItem>
          <SelectItem value='3'>Last 3 Days</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
