import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from '@untitled-ui/icons-react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SelectSingleEventHandler } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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

import { Calendar } from '../../../../components/ui/calendar';
import { CreateInvoiceFooter } from './create-invoice-footer';
import { CreateInvoiceHeader } from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';
import { InputAsRow } from './input-as-row';
import { useInvoiceFormContext } from './invoice-form-context';

const paymentDetailsSchema = z.object({
  issueDate: z.date({ required_error: 'An issue date is required.' }),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  memo: z.string().optional(),
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
  const { formData, setFormData } = useInvoiceFormContext();

  const form = useForm<PaymentDetailsFormData>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      memo: formData.memo,
    },
  });

  const router = useRouter();
  // TODO: Can we share these submits?
  const handleSubmit = form.handleSubmit((data, event) => {
    event?.preventDefault();
    const newFormData = { ...formData, ...data };
    const newFormDataForUrl = {
      ...newFormData,
      items: JSON.stringify(newFormData.items),
      issueDate: data.issueDate.toISOString(),
      dueDate: data.dueDate.toISOString(),
    };
    setFormData(newFormData);
    onSubmit?.(newFormData);
    router.push(
      `/invoices/create/review?${new URLSearchParams(
        newFormDataForUrl as unknown as Record<string, string>
      )}`
    );
  });

  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader step={3}>Payment Details</CreateInvoiceHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className='flex flex-col gap-12'>
          <FormField
            control={form.control}
            name='issueDate'
            render={({ field }) => (
              <FormItem>
                <InputAsRow>
                  <FormLabel>Issue date</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </InputAsRow>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dueDate'
            render={({ field }) => (
              <FormItem>
                <InputAsRow>
                  <FormLabel>Due date</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </InputAsRow>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='memo'
            render={({ field }) => (
              <FormItem>
                <InputAsRow>
                  <FormLabel>Memo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Payment terms or additional info'
                      className='w-[240px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </InputAsRow>
              </FormItem>
            )}
          />
          <CreateInvoiceFooter>
            <Button variant='outline' type='button' onClick={onBack}>
              <ArrowLeft className='mr-2 h-4 w-4' /> Back
            </Button>
            <Button
              className='bg-sorbet'
              type='submit'
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              // TODO: The review button should be disabled if the form is not valid
            >
              Review <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
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
  value,
  onChange,
}: {
  value: Date;
  onChange: SelectSingleEventHandler;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            className={cn(
              'w-[240px] pl-3 text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            {value ? format(value, 'PPP') : <span>Pick a date</span>}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={onChange}
          disabled={(date) =>
            date > new Date() || date < new Date('1900-01-01')
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};