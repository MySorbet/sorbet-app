import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DayPickerSingleProps } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// react-day-picker Matcher which allows any date after and including today
// TODO: Revisit this and the form validation ot accepting today
const isInTheFuture = (date: Date) => {
  const today = startOfDay(new Date());
  return date >= today;
};

const paymentDetailsSchema = z.object({
  issueDate: z
    .date({ required_error: 'An issue date is required.' })
    .refine(isInTheFuture, {
      message: 'Issue date must be today or a future date.',
    }),
  dueDate: z
    .date({ required_error: 'A due date is required.' })
    .refine(isInTheFuture, {
      message: 'Due date must be a future date',
    }),
  memo: z.string().max(800, 'Memo must be less than 800 characters').optional(), // Note: this max should match backend validation
});

export type PaymentDetailsFormData = z.infer<typeof paymentDetailsSchema>;

type InvoiceFormProps = {
  onSubmit?: (values: PaymentDetailsFormData) => void;
  formData?: PaymentDetailsFormData;
};

/**
 * Form controls for WYSIWYG invoice creation
 */
export const InvoiceForm = ({ onSubmit, formData }: InvoiceFormProps) => {
  const form = useForm<PaymentDetailsFormData>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      issueDate: formData?.issueDate ?? new Date(), // Prefill today's date
      dueDate: formData?.dueDate ?? addDays(new Date(), 7),
      memo: formData?.memo ?? '',
    },
    mode: 'all',
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit?.(data);
  });

  const { issueDate, dueDate } = form.watch();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='flex w-full flex-col gap-8'>
        <div className='flex gap-2'>
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
                    disabled={(date) =>
                      !isInTheFuture(date) || date < issueDate
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
      </form>
    </Form>
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
