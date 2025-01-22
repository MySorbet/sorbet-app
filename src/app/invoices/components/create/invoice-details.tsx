'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { Plus, Trash01 } from '@untitled-ui/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { checkInvoiceNumber } from '@/api/invoices/invoices';
import { TextMorph } from '@/components/motion-primitives/text-morph';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

import { calculateSubtotalTaxAndTotal } from '../dashboard/utils';
import { BackButton } from './back-button';
import { CreateInvoiceFooter } from './create-invoice-footer';
import { CreateInvoiceHeader } from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';
import { CreateInvoiceTitle } from './create-invoice-title';
import { ForwardButton } from './forward-button';
import { useInvoiceFormContext } from './invoice-form-context';
import { LongFormItem } from './long-form-item';
import { Stepper } from './stepper';
import { invoiceFormStringValidator } from './utils';

const InvoiceItemDataSchema = z.object({
  name: invoiceFormStringValidator('Item name'),
  quantity: z.coerce.number().min(1),
  amount: z.coerce.number().min(0),
});
export type InvoiceItemData = z.infer<typeof InvoiceItemDataSchema>;

const emptyInvoiceItemData: InvoiceItemData = {
  name: '',
  quantity: 1,
  amount: 0,
};

const DEFAULT_TAX_PERCENTAGE = 10;

const formSchema = z.object({
  projectName: invoiceFormStringValidator('Project name'),
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
  items: z.array(InvoiceItemDataSchema),
  tax: z.coerce.number().min(0).max(100).optional(),
});

export type InvoiceDetailsFormSchema = z.infer<typeof formSchema>;

/**
 * Create Invoice Step 2
 * Capture invoice details
 */
export const InvoiceDetails = ({
  onSubmit,
  onBack,
  invoiceNumber,
}: {
  onSubmit?: (values: InvoiceDetailsFormSchema) => void;
  onBack?: () => void;
  invoiceNumber?: string;
}) => {
  const { formData, serializeFormData } = useInvoiceFormContext();
  const form = useForm<InvoiceDetailsFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: formData.projectName ?? '',
      invoiceNumber: formData.invoiceNumber ?? invoiceNumber ?? '',
      items: formData.items ?? [emptyInvoiceItemData],
      tax: formData.tax ?? undefined,
    },
    mode: 'all',
  });

  // Effect to set the invoiceNumber form value to the
  // invoiceNumber prop if it is provided after a delay
  useEffect(() => {
    if (invoiceNumber) {
      form.setValue('invoiceNumber', invoiceNumber, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [form, invoiceNumber]);

  const { subtotal, taxAmount, total } = calculateSubtotalTaxAndTotal(
    form.getValues()
  );
  const formattedSubtotal = formatCurrency(subtotal);
  const formattedTaxAmount = formatCurrency(taxAmount);
  const formattedTotal = formatCurrency(total);

  const items = form.watch('items');
  const tax = form.watch('tax');
  const hasTax = tax !== undefined;

  const router = useRouter();
  const handleSubmit = form.handleSubmit((data, event) => {
    event?.preventDefault();
    const newFormData = { ...formData, ...data, tax: tax ?? undefined };
    onSubmit?.(newFormData);
    router.push(
      `/invoices/create/payment-details${serializeFormData(newFormData)}`
    );
  });

  return (
    <CreateInvoiceShell>
      <CreateInvoiceHeader>
        <CreateInvoiceTitle>Invoice Details</CreateInvoiceTitle>
        <Stepper step={2} totalSteps={3} />
      </CreateInvoiceHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className='flex w-full flex-col gap-12'>
          <FormField
            name='projectName'
            control={form.control}
            render={({ field }) => (
              <LongFormItem label='Project name'>
                <FormControl>
                  <Input placeholder='Enter name' {...field} />
                </FormControl>
                <FormMessage />
              </LongFormItem>
            )}
          />
          <FormField
            name='invoiceNumber'
            control={form.control}
            render={({ field }) => (
              <LongFormItem label='Invoice number'>
                <FormControl>
                  <Input placeholder='Enter Invoice number' {...field} />
                </FormControl>
                <FormMessage />
              </LongFormItem>
            )}
          />
          <div className='flex flex-col gap-3'>
            {items.map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`items.${index}`}
                render={({ field }) => (
                  <InvoiceItem
                    index={index}
                    item={field.value}
                    hideDelete={index === 0} // Can't delete the first item
                    hideLabel={index !== 0} // Only show label on the first item
                    className={cn(
                      index !== 0 && 'animate-in slide-in-from-top-3 fade-in-0'
                    )}
                    onDelete={() => {
                      const newItems = [...items];
                      newItems.splice(index, 1);
                      form.setValue('items', newItems, {
                        shouldValidate: true,
                      });
                    }}
                    onChange={(item) => {
                      field.onChange(item);
                    }}
                  />
                )}
              />
            ))}
            {hasTax && (
              <FormField
                name='tax'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SalesTaxItem
                        tax={field.value ?? 0}
                        onChange={field.onChange}
                        className='animate-in slide-in-from-top-3 fade-in-0'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className='space-x-4'>
              <Button
                variant='ghost'
                className='text-sorbet'
                type='button'
                onClick={() => {
                  form.setValue('items', [...items, emptyInvoiceItemData]);
                }}
              >
                <Plus className='mr-1 size-5' /> Add item
              </Button>
              {!hasTax && (
                <Button
                  variant='ghost'
                  type='button'
                  onClick={() => {
                    form.setValue('tax', DEFAULT_TAX_PERCENTAGE);
                  }}
                >
                  <Plus className='mr-1 size-5' /> Sales tax
                </Button>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-1 border-t border-gray-200 py-4'>
            {hasTax && (
              <>
                <div className='flex justify-between gap-1'>
                  <span className='text-sm font-semibold'>Subtotal</span>
                  <TextMorph className='text-base font-medium'>
                    {formattedSubtotal}
                  </TextMorph>
                </div>
                <div className='flex justify-between gap-1'>
                  <span className='text-sm font-semibold'>{`Tax (${tax}%)`}</span>
                  <TextMorph className='text-base font-medium'>
                    {formattedTaxAmount}
                  </TextMorph>
                </div>
              </>
            )}
            <div className='flex justify-between gap-1'>
              <span className='text-sm font-semibold'>Total</span>
              <TextMorph className='text-xl font-semibold'>
                {formattedTotal}
              </TextMorph>
            </div>
          </div>
          <CreateInvoiceFooter>
            <BackButton onClick={onBack}>Back</BackButton>
            <ForwardButton
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Payment Details
            </ForwardButton>
          </CreateInvoiceFooter>
        </form>
      </Form>
    </CreateInvoiceShell>
  );
};

// TODO: Revisit FormItem, FormControl, FormMessage for these and how they fit into validation in general
/**
 * Local component to display a single invoice item
 */
const InvoiceItem = ({
  item,
  hideDelete,
  onDelete,
  onChange,
  hideLabel,
  index,
  className,
}: {
  item: InvoiceItemData;
  hideDelete?: boolean;
  hideLabel?: boolean;
  onDelete?: () => void;
  onChange?: (item: InvoiceItemData) => void;
  index: number;
  className?: string;
}) => {
  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className='flex justify-between gap-6'>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          {!hideLabel && (
            <Label htmlFor='item' className='flex-1 text-sm font-medium'>
              Item
            </Label>
          )}
          <Input
            id='item'
            placeholder='Item name'
            type='text'
            value={item.name}
            onChange={(e) => {
              onChange?.({ ...item, name: e.target.value });
            }}
            autoFocus={index !== 0}
          />
        </div>
        <div className='grid w-full max-w-32 items-center gap-1.5'>
          {!hideLabel && (
            <Label htmlFor='quantity' className='text-sm font-medium'>
              Quantity
            </Label>
          )}
          <Input
            id='quantity'
            placeholder='quantity'
            type='number'
            value={item.quantity}
            onChange={(e) => {
              onChange?.({ ...item, quantity: parseInt(e.target.value) });
            }}
            className='no-spin-buttons text-right'
          />
        </div>
        <div className='grid w-full max-w-56 items-center gap-1.5'>
          {!hideLabel && (
            <Label htmlFor='amount' className='text-sm font-medium'>
              Amount
            </Label>
          )}
          <Input
            id='amount'
            type='number'
            placeholder='amount'
            value={item.amount}
            onChange={(e) => {
              const value = e.target.value;
              // TODO: There must be a better way to coerce the number from the input
              onChange?.({
                ...item,
                amount: value === '' ? 0 : parseFloat(value),
              });
            }}
            className='no-spin-buttons text-right'
          />
        </div>
        {hideDelete ? (
          // Take up the same amount of space as the delete button below
          <div className='w-[3.2rem] flex-shrink-0' />
        ) : (
          <Button variant='ghost' type='button' onClick={onDelete}>
            <Trash01 className='size-5' />
          </Button>
        )}
      </div>
      {/* TODO: Revisit FormMessage errors for these items. Currently, they just say "undefined" */}
      {/* <FormMessage /> */}
    </div>
  );
};

/**
 * Local component to display a single sales tax item
 */
const SalesTaxItem = ({
  tax,
  onChange,
  className,
}: {
  tax: number;
  onChange?: (tax: number | undefined) => void;
  className?: string;
}) => {
  return (
    <div className={cn('flex items-center justify-between gap-6', className)}>
      <Label htmlFor='tax' className='w-full min-w-fit max-w-sm'>
        Sales Tax (%)
      </Label>

      {/* Placeholder div to align with row above */}
      <div className='h-full w-full max-w-32' aria-hidden='true' />

      {/* Sales tax input with suffix */}
      <div className='relative w-full max-w-56'>
        <Input
          id='tax'
          type='number'
          placeholder='Sales tax'
          value={tax}
          onChange={(e) => {
            const value = e.target.value;
            onChange?.(value === '' ? 0 : parseFloat(value));
          }}
          className='no-spin-buttons pr-7 text-right'
          autoFocus
        />
        <span className='absolute right-3 top-1/2 -translate-y-1/2'>%</span>
      </div>
      <Button
        variant='ghost'
        type='button'
        onClick={() => onChange?.(undefined)}
      >
        <Trash01 className='size-5' />
      </Button>
    </div>
  );
};
