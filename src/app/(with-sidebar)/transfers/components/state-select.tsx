import { iso31662 } from 'iso-3166';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const usStates = iso31662.filter((state) => state.parent === 'US');

export const StateSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder='Select a state' />
      </SelectTrigger>
      <SelectContent>
        {usStates.map((state) => (
          <SelectItem key={state.code} value={state.code}>
            {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const isISO31662 = (value: string) => {
  return usStates.some((state) => state.code === value);
};
