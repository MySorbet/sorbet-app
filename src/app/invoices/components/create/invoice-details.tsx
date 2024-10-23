'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { ArrowLeft, ArrowRight, Plus, Trash01 } from '@untitled-ui/icons-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { InputAsRow } from '@/app/invoices/components/create/input-as-row';
import { TextMorph } from '@/components/motion-primitives/text-morph';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { calculateTotalAmount, formatCurrency } from '../dashboard/utils';
import { CreateInvoiceFooter } from './create-invoice-footer';
import {
  CreateInvoiceHeader,
  CreateInvoiceTitle,
} from './create-invoice-header';
import { CreateInvoiceShell } from './create-invoice-shell';
import { useInvoiceFormContext } from './invoice-form-context';
import { Stepper } from './stepper';

const InvoiceItemDataSchema = z.object({
  name: z.string().min(1).max(50),
  quantity: z.coerce.number().min(1),
  amount: z.coerce.number().min(0),
});
export type InvoiceItemData = z.infer<typeof InvoiceItemDataSchema>;

const emptyInvoiceItemData: InvoiceItemData = {
  name: '',
  quantity: 1,
  amount: 0,
};

const formSchema = z.object({
  projectName: z.string().min(1).max(50),
  invoiceNumber: z.string().min(1).max(50),
  items: z.array(InvoiceItemDataSchema),
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
      invoiceNumber: invoiceNumber ?? formData.invoiceNumber ?? '',
      items: formData.items ?? [emptyInvoiceItemData],
    },
  });

  const items = form.watch('items');
  const formattedTotal = formatCurrency(calculateTotalAmount(items ?? []));

  const router = useRouter();
  const handleSubmit = form.handleSubmit((data, event) => {
    event?.preventDefault();
    const newFormData = { ...formData, ...data };
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
        <form onSubmit={handleSubmit} className='flex flex-col gap-12'>
          <FormField
            name='projectName'
            control={form.control}
            render={({ field }) => (
              <InputAsRow>
                <FormLabel>Project name</FormLabel>
                <FormItem className='w-full max-w-md'>
                  <Input placeholder='Project name' {...field} />
                  <FormMessage />
                </FormItem>
              </InputAsRow>
            )}
          />
          <FormField
            name='invoiceNumber'
            control={form.control}
            render={({ field }) => (
              <InputAsRow>
                <FormLabel>Invoice number</FormLabel>
                <FormItem className='w-full max-w-md'>
                  <Input placeholder='Invoice number' {...field} />
                  <FormMessage />
                </FormItem>
              </InputAsRow>
            )}
          />
          <div className='flex flex-col gap-3'>
            {items.map((item, index) => (
              <InvoiceItem
                key={index}
                index={index}
                item={item}
                hideDelete={index === 0}
                hideLabel={index !== 0}
                className={
                  cn(index !== 0 && 'animate-in slide-in-from-top-3 fade-in-0') // Animate in all but the first item
                }
                onDelete={() => {
                  form.setValue(
                    'items',
                    items.filter((_, i) => i !== index),
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    }
                  );
                }}
                onChange={(item) => {
                  form.setValue(
                    'items',
                    [...items.slice(0, index), item, ...items.slice(index + 1)],
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    }
                  );
                }}
              />
            ))}
            <Button
              variant='ghost'
              className='text-sorbet self-start'
              type='button'
              onClick={() => {
                form.setValue('items', [...items, emptyInvoiceItemData]);
              }}
            >
              <Plus className='mr-1 size-5' /> Add item
            </Button>
          </div>

          <div className='flex justify-between border-t border-gray-200 py-4'>
            <span className='text-sm font-semibold'>Total</span>
            <TextMorph className='text-xl font-semibold'>
              {formattedTotal}
            </TextMorph>
          </div>
          <CreateInvoiceFooter>
            <Button variant='outline' type='button' onClick={onBack}>
              <ArrowLeft className='mr-2 h-4 w-4' /> Back
            </Button>
            <Button
              className='bg-sorbet'
              type='submit'
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Payment Details <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </CreateInvoiceFooter>
        </form>
      </Form>
    </CreateInvoiceShell>
  );
};

// TODO: Revisit FormMessage errors for these items
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
    <div className={cn(className, 'flex flex-row justify-between gap-6')}>
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
            onChange?.({ ...item, amount: parseFloat(e.target.value) });
          }}
          className='text-right'
        />
      </div>
      {hideDelete ? (
        <div className='w-12 flex-shrink-0' />
      ) : (
        <Button variant='ghost' type='button' onClick={onDelete}>
          <Trash01 className='size-5' />
        </Button>
      )}
    </div>
  );
};
