import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DayPickerSingleProps } from 'react-day-picker';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { checkInvoiceNumber } from '@/api/invoices';
import { invoiceFormStringValidator } from '@/app/invoices/components/create/utils';
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
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { ItemsCard } from './items-card';
import { emptyInvoiceItemData, InvoiceItemDataSchema } from './schema';

// react-day-picker Matcher which allows any date after and including today
// TODO: Revisit this and the form validation ot accepting today
const isInTheFuture = (date: Date) => {
  const today = startOfDay(new Date());
  return date >= today;
};

const schema = z.object({
  // TODO: This is a temp adapter to work with existing invoice schema. should be replaced with client card
  toName: invoiceFormStringValidator('Name'),
  toEmail: invoiceFormStringValidator('Email').email({
    message: 'Must be a valid email address',
  }),
  items: z.array(InvoiceItemDataSchema),
  invoiceNumber: invoiceFormStringValidator('Invoice number').refine(
    async (invoiceNumber) => {
      // No need to call the API for empty strings
      if (!invoiceNumber) return true;
      const { isAvailable } = await checkInvoiceNumber(invoiceNumber);
      return isAvailable;
    },
    // TODO: can we make a recommendation from the error state?
    { message: "You've already used this invoice number" }
  ),
  tax: z.coerce.number().min(0).max(100).optional(),
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

export type InvoiceFormData = z.infer<typeof schema>;

type InvoiceFormProps = {
  onSubmit?: (values: InvoiceFormData) => void;
  formData?: InvoiceFormData;
};

/**
 * Form controls for WYSIWYG invoice creation
 */
export const InvoiceForm = ({ onSubmit, formData }: InvoiceFormProps) => {
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      issueDate: formData?.issueDate ?? new Date(), // Prefill today's date
      dueDate: formData?.dueDate ?? addDays(new Date(), 7),
      memo: formData?.memo ?? '',
      items: formData?.items ?? [emptyInvoiceItemData],
      invoiceNumber: formData?.invoiceNumber ?? '',
      tax: formData?.tax ?? 0,
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
        <FakeClientCard form={form} />
        <ItemsCard
          items={form.watch('items')}
          onItemsChange={(items) => form.setValue('items', items)}
        />
        <div className='flex gap-2'>
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
        </div>
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

const FakeClientCard = ({ form }: { form: UseFormReturn<InvoiceFormData> }) => {
  return (
    <div>
      <FormField
        name='toName'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder='Client name' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name='toEmail'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type='email'
                placeholder='Client email address'
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
