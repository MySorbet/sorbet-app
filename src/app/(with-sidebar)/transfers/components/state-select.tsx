import { iso31662 } from 'iso-3166';
import { useMemo } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const StateSelect = ({
  value,
  onChange,
  parent = 'US',
  disabled = false,
}: {
  value?: string;
  onChange: (value: string) => void;
  parent?: string;
  disabled?: boolean;
}) => {
  // Display only states that match the parent country
  const states = useMemo(
    () => iso31662.filter((state) => state.code.slice(0, 2) === parent),
    [parent]
  );
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={states.length === 0 || disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder='Select a state' />
      </SelectTrigger>
      <SelectContent>
        {states.map((state) => (
          <SelectItem key={state.code} value={state.code}>
            {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const isISO31662 = (value: string) => {
  return iso31662.some((state) => state.code === value);
};
