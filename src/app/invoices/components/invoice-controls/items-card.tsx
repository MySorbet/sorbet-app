'use client';

import { Plus } from 'lucide-react';

import { CompactDeleteButton } from '@/components/common/compact-delete-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { type InvoiceItem, emptyInvoiceItem } from '../../schema';

/** Card allowing a list of items (making up an invoice) to be added, edited, and deleted */
export const ItemsCard = ({
  items,
  onItemsChange,
}: {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}) => {
  // TODO: These handlers used to be integrated with the parent form. Either do this again, or use this as another layer
  // Check out useFieldArray as a potential solution: https://react-hook-form.com/docs/usefieldarray
  const handleDelete = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onItemsChange(newItems);
  };

  const handleChange = (index: number, item: InvoiceItem) => {
    const newItems = [...items];
    newItems[index] = item;
    onItemsChange(newItems);
  };

  const handleAddItem = () => {
    onItemsChange([...items, emptyInvoiceItem]);
  };

  return (
    <Card className='bg-primary-foreground flex h-fit flex-col gap-4 p-2'>
      <div className='flex flex-col gap-1.5'>
        {items.map((item, index) => (
          <InvoiceItem
            index={index}
            item={item}
            hideDelete={index === 0} // Can't delete the first item
            hideLabel={index !== 0} // Only show label on the first item
            className={cn(
              index !== 0 && 'animate-in slide-in-from-top-3 fade-in-0' // animate in all items except the first one
            )}
            onDelete={() => handleDelete(index)}
            onChange={(item) => handleChange(index, item)}
            key={index}
          />
        ))}
      </div>
      <Button variant='ghost' onClick={handleAddItem} className='w-fit'>
        <Plus />
        Add item
      </Button>
    </Card>
  );
};

const InvoiceItem = ({
  item,
  hideDelete,
  onDelete,
  onChange,
  hideLabel,
  index,
  className,
}: {
  item: InvoiceItem;
  hideDelete?: boolean;
  hideLabel?: boolean;
  onDelete?: () => void;
  onChange?: (item: InvoiceItem) => void;
  index: number;
  className?: string;
}) => {
  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className='flex justify-between gap-2'>
        <div className='flex-2 grid w-full max-w-sm items-center gap-1.5'>
          {!hideLabel && (
            <Label htmlFor='item-name' className='flex-1 text-sm font-medium'>
              Item name
            </Label>
          )}
          <Input
            id='item-name'
            placeholder='Enter name'
            type='text'
            value={item.name}
            onChange={(e) => {
              onChange?.({ ...item, name: e.target.value });
            }}
            autoFocus={index !== 0}
          />
        </div>
        <div className='grid w-full min-w-12 max-w-32 flex-1 items-center gap-1.5'>
          {!hideLabel && (
            <Label htmlFor='quantity' className='text-sm font-medium'>
              Qty
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
            className='no-spin-buttons'
          />
        </div>
        <div className='flex-2 grid w-full max-w-56 items-center gap-1.5'>
          {!hideLabel && (
            <Label htmlFor='amount' className='text-sm font-medium'>
              Price (USD)
            </Label>
          )}
          <Input
            id='amount'
            type='number'
            placeholder='amount'
            value={item.amount === 0 ? '' : item.amount}
            onChange={(e) => {
              const value = e.target.value;
              // TODO: There must be a better way to coerce the number from the input
              onChange?.({
                ...item,
                amount: value === '' ? 0 : parseFloat(value),
              });
            }}
            className='no-spin-buttons'
          />
        </div>
        {hideDelete ? (
          // Take up the same amount of space as the delete button below
          <div className='w-6 shrink-0' />
        ) : (
          <CompactDeleteButton
            onDelete={onDelete}
            className='-ml-1 self-center'
          />
        )}
      </div>
      {/* TODO: Revisit FormMessage errors for these items. Currently, they just say "undefined" */}
      {/* <FormMessage /> */}
    </div>
  );
};
