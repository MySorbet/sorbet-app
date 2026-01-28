'use client';

import { CircleFlag } from 'react-circle-flags';

import {
  DuePaymentMethod,
  PAYMENT_METHOD_OPTIONS,
  PaymentMethodOption,
} from '@/api/recipients/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  value?: DuePaymentMethod;
  onChange: (method: PaymentMethodOption) => void;
  className?: string;
}

const PaymentMethodFlag = ({ countryCode }: { countryCode: string }) => {
  return <CircleFlag countryCode={countryCode} className='size-5' />;
};

export const PaymentMethodSelector = ({
  value,
  onChange,
  className,
}: PaymentMethodSelectorProps) => {
  const selectedMethod = PAYMENT_METHOD_OPTIONS.find((m) => m.id === value);

  const handleValueChange = (newValue: string) => {
    const method = PAYMENT_METHOD_OPTIONS.find((m) => m.id === newValue);
    if (method) {
      onChange(method);
    }
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder='Select payment method'>
          {selectedMethod && (
            <span className='flex items-center gap-2'>
              <PaymentMethodFlag countryCode={selectedMethod.flagCountryCode} />
              <span>{selectedMethod.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {PAYMENT_METHOD_OPTIONS.map((method) => (
          <SelectItem key={method.id} value={method.id}>
            <span className='flex items-center gap-2'>
              <PaymentMethodFlag countryCode={method.flagCountryCode} />
              <span>{method.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
