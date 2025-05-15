import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { RecipientAPI } from '@/api/recipients/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const SendToCard = ({
  className,
  recipients,
  onAdd,
}: {
  className?: string;
  recipients?: RecipientAPI[];
  onAdd?: () => void;
}) => {
  const [selectedRecipient, setSelectedRecipient] =
    useState<RecipientAPI | null>(null);
  const handleSelect = (value: string) => {
    if (value === 'add-new') {
      setSelectedRecipient(null);
      onAdd?.();
    } else {
      setSelectedRecipient(
        recipients?.find((recipient) => recipient.id === value) || null
      );
    }
  };
  const [amount, setAmount] = useState<number>(0);

  const disabled = amount === 0 || !selectedRecipient;

  const handleSend = () => {
    toast.success(`Sending ${amount} USDC to ${selectedRecipient?.label}`);
  };

  return (
    <Card className={cn('min-w-64 max-w-md space-y-10 p-6', className)}>
      <div className='space-y-2'>
        <Label>Send to</Label>
        <Select onValueChange={handleSelect} value={selectedRecipient?.id}>
          <SelectTrigger>
            <SelectValue placeholder='Select a recipient' />
          </SelectTrigger>
          <SelectContent>
            {recipients?.map((recipient) => (
              <SelectItem key={recipient.id} value={recipient.id}>
                {recipient.label}
              </SelectItem>
            ))}
            <SelectItem value='add-new' className='pl-1'>
              <div className='flex items-center gap-2 font-semibold'>
                <Plus className='size-5' />
                Add new recipient
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* <div className='flex flex-col gap-2'>
        <pre className='text-muted-foreground text-sm'>
          {JSON.stringify(selectedRecipient, null, 2)}
        </pre>
      </div> */}
      <div className='space-y-2'>
        <Label>Amount</Label>
        <Input
          id='amount'
          type='number'
          placeholder='0.0'
          value={String(amount)}
          onChange={(e) => setAmount(Number(e.target.value))}
          className='no-spin-buttons'
        />
      </div>
      <Button
        className='w-full'
        variant='sorbet'
        disabled={disabled}
        onClick={handleSend}
      >
        Send
      </Button>
    </Card>
  );
};
