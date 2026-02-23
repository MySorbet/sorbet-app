'use client';

import { Plus } from 'lucide-react';

import { CompactDeleteButton } from '@/components/common/compact-delete-button';
import { Button } from '@/components/ui/button';
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
    <div className='flex h-fit flex-col gap-4'>
      <div className='flex flex-col gap-4'>
        {items.map((item, index) => (
          <InvoiceItem
            index={index}
            item={item}
            hideDelete={index === 0 && items.length === 1} // Can't delete if it's the only item
            className={cn(
              index !== 0 && 'animate-in slide-in-from-top-3 fade-in-0' // animate in all items except the first one
            )}
            onDelete={() => handleDelete(index)}
            onChange={(item) => handleChange(index, item)}
            key={index}
          />
        ))}
      </div>
      <Button variant='outline' onClick={handleAddItem} className='w-full border-dashed text-primary font-medium bg-background hover:bg-muted/50'>
        <Plus className='mr-2 h-4 w-4' />
        Add new item
      </Button>
    </div>
  );
};

const InvoiceItem = ({
  item,
  hideDelete,
  onDelete,
  onChange,
  index,
  className,
}: {
  item: InvoiceItem;
  hideDelete?: boolean;
  onDelete?: () => void;
  onChange?: (item: InvoiceItem) => void;
  index: number;
  className?: string;
}) => {
  return (
    <div className={cn(className, 'flex flex-col gap-4 rounded-lg border p-4 bg-background shadow-sm')}>
      <div className='flex justify-between items-start gap-4'>
        <div className='flex-2 grid w-full flex-1 items-center gap-1.5'>
          <Label htmlFor={`item-name-${index}`} className='text-sm font-medium'>
            Item name
          </Label>
          <Input
            id={`item-name-${index}`}
            placeholder='Enter name'
            type='text'
            value={item.name}
            onChange={(e) => {
              onChange?.({ ...item, name: e.target.value });
            }}
            autoFocus={index !== 0}
          />
        </div>
        <div className='grid w-full max-w-[100px] items-center gap-1.5'>
          <Label htmlFor={`quantity-${index}`} className='text-sm font-medium'>
            Qty
          </Label>
          <Input
            id={`quantity-${index}`}
            placeholder='quantity'
            type='number'
            value={item.quantity}
            onChange={(e) => {
              onChange?.({ ...item, quantity: parseInt(e.target.value) });
            }}
            className='no-spin-buttons'
          />
        </div>
        <div className='flex-2 grid w-full max-w-[140px] items-center gap-1.5'>
          <Label htmlFor={`amount-${index}`} className='text-sm font-medium'>
            Price (USD)
          </Label>
          <Input
            id={`amount-${index}`}
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
        {!hideDelete && (
          <div className='flex items-center pt-6'>
            <CompactDeleteButton
              onDelete={onDelete}
              className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            />
          </div>
        )}
      </div>
      {/* TODO: Revisit FormMessage errors for these items. Currently, they just say "undefined" */}
      {/* <FormMessage /> */}
    </div>
  );
};
