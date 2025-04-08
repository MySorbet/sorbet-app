import { CircleAlert } from 'lucide-react';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useInvoiceForm } from '../../hooks/use-invoice-form';

/**
 * The 3rd tab of the invoice controls, "Your info"
 * - Manipulates form data via `useInvoiceForm`
 */
export const YourInfoTab = () => {
  const form = useInvoiceForm();

  return (
    <div className='flex flex-col gap-6'>
      <FormField
        name='fromName'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder='Your name' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name='fromEmail'
        control={form.control}
        render={({ field }) => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type='email' placeholder='Your email address' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex items-center justify-between gap-2'>
        <FormLabel htmlFor='business-switch'>Business</FormLabel>
        <Switch id='business-switch' checked={false} disabled />
      </div>
      <div className='flex items-center justify-between gap-2'>
        <FormLabel htmlFor='tax-id-switch' className='flex items-center gap-1'>
          Tax ID
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleAlert className='text-muted-foreground size-4 shrink-0 cursor-pointer' />
            </TooltipTrigger>
            <TooltipContent>
              {/* // TODO: Replace with a more detailed explanation of the tax ID field */}
              Tax ID is not yet available. Check back soon.
            </TooltipContent>
          </Tooltip>
        </FormLabel>
        <Switch id='tax-id-switch' checked={false} disabled />
      </div>
      <div className='flex items-center justify-between gap-2'>
        <FormLabel htmlFor='address-switch'>Address</FormLabel>
        <Switch id='address-switch' checked={false} disabled />
      </div>
    </div>
  );
};
