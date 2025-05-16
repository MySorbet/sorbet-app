import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

import { RecipientAPI } from '@/api/recipients/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

export const SendToCard = ({
  className,
  recipients,
  onAdd,
  onSend,
  maxAmount,
}: {
  className?: string;
  recipients?: RecipientAPI[];
  onAdd?: () => void;
  onSend?: (amount: number, address: string) => void;
  maxAmount?: number;
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(
      formSchema.extend({
        amount: z
          .number()
          .gt(0)
          .max(maxAmount ?? Infinity, {
            message: `You have ${formatCurrency(maxAmount ?? 0)} available`,
          }),
      })
    ),
    defaultValues: {
      recipient: '',
      amount: 0,
    },
    mode: 'all',
  });

  const { isValid, isSubmitting, errors } = useFormState(form);
  const disabled = isSubmitting || !isValid;

  const onSubmit = (data: FormSchema) => {
    const address = recipients?.find(
      (recipient) => recipient.id === data.recipient
    )?.walletAddress;
    if (address) {
      onSend?.(data.amount, address);
    }
  };

  return (
    <Card className={cn('min-w-64 max-w-lg p-6', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
          {/* Recipient select */}
          <FormField
            control={form.control}
            name='recipient'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send to</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === 'add-new') {
                        field.onChange(null);
                        onAdd?.();
                      } else {
                        field.onChange(value);
                      }
                    }}
                  >
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='space-y-3'>
            {/* Amount input */}
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={String(field.value)}
                      onChange={(e) =>
                        form.setValue('amount', Number(e.target.value))
                      }
                      type='number'
                      className='no-spin-buttons'
                    />
                  </FormControl>
                  {maxAmount && !errors.amount && (
                    <p className='text-muted-foreground text-sm'>
                      {formatCurrency(maxAmount)} available
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Percentage buttons */}
            {maxAmount && (
              <div className='flex w-full gap-2'>
                {PERCENTAGES.map((percentage) => (
                  <PercentageButton
                    key={percentage}
                    percentage={percentage}
                    onClick={() =>
                      form.setValue('amount', maxAmount * (percentage / 100), {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            className='w-full transition-opacity duration-200'
            variant='sorbet'
            disabled={disabled}
            type='submit'
          >
            Send
          </Button>
        </form>
      </Form>
    </Card>
  );
};

const formSchema = z.object({
  recipient: z.string().min(1, {
    message: '',
  }),
  amount: z.number(),
});
type FormSchema = z.infer<typeof formSchema>;

/** What percentages should the user be able to select? */
const PERCENTAGES = [25, 50, 75, 100];

/** Local component to render a button showing a percentage of the max amount and a callback to set that percentage*/
const PercentageButton = ({
  percentage,
  onClick,
}: {
  percentage: number;
  onClick?: (percentage: number) => void;
}) => {
  return (
    <Button
      variant='secondary'
      className='min-w-fit flex-1'
      type='button'
      onClick={() => onClick?.(percentage)}
    >
      {percentage}%
    </Button>
  );
};
