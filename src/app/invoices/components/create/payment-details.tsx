import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DayPickerSingleProps } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { BackButton } from './back-button';
import { CreateInvoiceFooter } from './create-invoice-footer';
import { CreateInvoiceHeader } from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';
import { CreateInvoiceTitle } from './create-invoice-title';
import { ForwardButton } from './forward-button';
import { useInvoiceFormContext } from './invoice-form-context';
import { LongFormItem } from './long-form-item';
import { Stepper } from './stepper';

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

type PaymentDetailsProps = {
  onBack?: () => void;
  onSubmit?: (values: PaymentDetailsFormData) => void;
};
/**
 * Create Invoice Step 3
 * Capture issue and due dates and memo
 */
export const PaymentDetails = ({ onBack, onSubmit }: PaymentDetailsProps) => {
  const { formData, serializeFormData } = useInvoiceFormContext();

  const form = useForm<PaymentDetailsFormData>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      issueDate: formData.issueDate ?? new Date(), // Prefill today's date
      dueDate: formData.dueDate ?? addDays(new Date(), 7),
      memo: formData.memo ?? '',
    },
    mode: 'all',
  });

  const router = useRouter();
  // TODO: Can we share these submits?
  const handleSubmit = form.handleSubmit((data, event) => {
    event?.preventDefault();
    const newFormData = { ...formData, ...data, memo: data.memo ?? undefined }; // TODO: Can we remove this hack?
    onSubmit?.(newFormData);
    router.push(`/invoices/create/review${serializeFormData(newFormData)}`);
  });

  const { issueDate, dueDate } = form.watch();

  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader>
        <CreateInvoiceTitle>Payment Details</CreateInvoiceTitle>
        <Stepper step={3} totalSteps={3} />
      </CreateInvoiceHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className='flex w-full flex-col gap-12'>
          <FormField
            control={form.control}
            name='issueDate'
            render={({ field }) => (
              <LongFormItem label='Issue date'>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => !isInTheFuture(date) || date > dueDate}
                  />
                </FormControl>
                <FormMessage />
              </LongFormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dueDate'
            render={({ field }) => (
              <LongFormItem label='Due date'>
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
              </LongFormItem>
            )}
          />
          <FormField
            control={form.control}
            name='memo'
            render={({ field }) => (
              <LongFormItem label='Memo'>
                <FormControl>
                  <Textarea
                    placeholder='Payment terms or additional info'
                    className='max-h-72 min-h-28 w-full max-w-md resize-y'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </LongFormItem>
            )}
          />
          <CreateInvoiceFooter>
            <BackButton onClick={onBack}>Back</BackButton>
            <ForwardButton
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Review
            </ForwardButton>
          </CreateInvoiceFooter>
        </form>
      </Form>
    </CreateInvoiceShell>
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
