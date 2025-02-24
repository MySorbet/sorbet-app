import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DayPickerSingleProps } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { useInvoiceForm } from '../../hooks/use-invoice-form';
import { isInTheFuture } from '../../schema';
import { FakeClientCard } from '../client-card/fake-client-card';
import { ItemsCard } from './items-card';

/** "New invoice" section of the invoice controls */
export const NewInvoiceTab = () => {
  const form = useInvoiceForm();
  const { issueDate, dueDate } = form.watch();

  return (
    <div className='flex w-full flex-col gap-10'>
      {/* // TODO: Use client card component and hooks instead */}
      <FakeClientCard />
      <ItemsCard
        items={form.watch('items')}
        onItemsChange={(items) => form.setValue('items', items)}
      />
      <DualFormFields>
        <FormField
          name='invoiceNumber'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice number</FormLabel>
              <FormControl>
                <Input placeholder='Enter Invoice number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='tax'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sales tax</FormLabel>
              <FormControl>
                <div className='relative w-full'>
                  <Input
                    id='tax'
                    type='number'
                    placeholder='0'
                    className='no-spin-buttons pr-7 text-right'
                    {...field}
                  />
                  <span className='absolute right-3 top-1/2 -translate-y-1/2'>
                    %
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </DualFormFields>
      <DualFormFields>
        <FormField
          control={form.control}
          name='issueDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue date</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => !isInTheFuture(date) || date > dueDate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dueDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due date</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => !isInTheFuture(date) || date < issueDate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </DualFormFields>
      <FormField
        control={form.control}
        name='memo'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Memo (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder='Payment terms or additional info'
                className='max-h-72 min-h-28 w-full resize-y'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

/**
 * Local component to handle date picking
 */
const DatePicker = ({
  selected,
  onSelect,
  disabled,
}: Pick<DayPickerSingleProps, 'selected' | 'onSelect' | 'disabled'>) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            className={cn(
              'w-full max-w-md pl-3 text-left font-normal',
              !selected && 'text-muted-foreground'
            )}
          >
            {selected ? format(selected, 'PPP') : <span>Pick a date</span>}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={selected}
          onSelect={onSelect}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

/** Layout two form fields side by side */
const DualFormFields = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex w-full justify-between gap-2', className)}>
      {children}
    </div>
  );
};
