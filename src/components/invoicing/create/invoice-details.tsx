import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { ArrowLeft, ArrowRight, Plus, Trash01 } from '@untitled-ui/icons-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { InputAsRow } from '@/components/invoicing/create/input-as-row';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { CreateInvoiceFooter } from './create-invoice-footer';
import { CreateInvoiceHeader } from './create-invoice-header';

const InvoiceItemDataSchema = z.object({
  name: z.string().min(1).max(50),
  quantity: z.number().min(1),
  amount: z.number().min(1),
});
type InvoiceItemData = z.infer<typeof InvoiceItemDataSchema>;

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

/**
 * Create Invoice Step 2
 * Capture invoice details
 */
export const InvoiceDetails = ({
  onSubmit,
  invoiceNumber,
}: {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  invoiceNumber: string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      invoiceNumber: invoiceNumber,
      items: [emptyInvoiceItemData],
    },
  });

  const items = form.watch('items');

  return (
    <>
      <CreateInvoiceHeader step={2}>Invoice Details</CreateInvoiceHeader>
      <Form {...form}>
        <form
          onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined}
          className='flex flex-col gap-12'
        >
          <FormField
            name='projectName'
            control={form.control}
            render={({ field }) => (
              <InputAsRow>
                <FormLabel>Project name</FormLabel>
                <FormItem>
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
                <FormItem>
                  <Input placeholder='Invoice number' {...field} disabled />
                </FormItem>
              </InputAsRow>
            )}
          />
          <div className='flex flex-col gap-3'>
            {items.map((item, index) => (
              <InvoiceItem
                key={index}
                item={item}
                hideDelete={index === 0}
                hideLabel={index !== 0}
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
            <span className='text-xl font-semibold'>
              $
              {items
                .reduce((acc, item) => acc + item.amount, 0)
                .toFixed(2)
                .toLocaleString()}
            </span>
          </div>
          <CreateInvoiceFooter>
            <Button variant='outline' type='button'>
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
    </>
  );
};

/**
 * Local component to display a single invoice item
 */
const InvoiceItem = ({
  item,
  hideDelete,
  onDelete,
  onChange,
  hideLabel,
}: {
  item: InvoiceItemData;
  hideDelete?: boolean;
  hideLabel?: boolean;
  onDelete?: () => void;
  onChange?: (item: InvoiceItemData) => void;
}) => {
  return (
    <div className='flex flex-row justify-between gap-6'>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        {!hideLabel && (
          <Label htmlFor='item' className='text-sm font-medium'>
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
        />
      </div>
      <div className='grid w-full items-center gap-1.5'>
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
        />
      </div>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
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
            onChange?.({ ...item, amount: parseInt(e.target.value) });
          }}
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
