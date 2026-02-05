import { CircleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

import { type InvoicingDetails, getInvoicingDetails } from '@/api/invoicing';
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
import { useAuth } from '@/hooks';

import { useInvoiceForm } from '../../hooks/use-invoice-form';

/**
 * The 3rd tab of the invoice controls, "Your info"
 * - Manipulates form data via `useInvoiceForm`
 */
export const YourInfoTab = () => {
  const form = useInvoiceForm();
  const { user } = useAuth();
  const [invoicingDetails, setInvoicingDetails] =
    useState<InvoicingDetails | null>(null);
  const [useBusiness, setUseBusiness] = useState(false);
  const [useTaxId, setUseTaxId] = useState(false);
  const [useAddress, setUseAddress] = useState(false);

  // Fetch invoicing details
  useEffect(() => {
    if (user?.id) {
      getInvoicingDetails(user.id)
        .then(setInvoicingDetails)
        .catch(() => {
          // Silently fail if invoicing details don't exist
        });
    }
  }, [user?.id]);

  // Handle business toggle change
  const handleBusinessToggle = (checked: boolean) => {
    setUseBusiness(checked);
    if (checked && invoicingDetails?.businessName) {
      form.setValue('fromName', invoicingDetails.businessName);
    }
  };

  // Handle tax ID toggle change
  const handleTaxIdToggle = (checked: boolean) => {
    setUseTaxId(checked);
    if (checked && invoicingDetails?.taxId) {
      form.setValue('taxId', invoicingDetails.taxId);
    } else {
      form.setValue('taxId', undefined);
    }
  };

  // Handle address toggle change
  const handleAddressToggle = (checked: boolean) => {
    setUseAddress(checked);
    if (checked && invoicingDetails) {
      const { street, city, state, country, postalCode } = invoicingDetails;
      if (street && city && state && country && postalCode) {
        form.setValue('address', {
          street,
          city,
          state,
          country,
          zip: postalCode,
        });
      }
    } else {
      form.setValue('address', undefined);
    }
  };

  const hasBusinessName = !!invoicingDetails?.businessName;
  const hasTaxId = !!invoicingDetails?.taxId;
  const hasAddress =
    !!invoicingDetails?.street &&
    !!invoicingDetails?.city &&
    !!invoicingDetails?.state &&
    !!invoicingDetails?.country &&
    !!invoicingDetails?.postalCode;

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
        <Switch
          id='business-switch'
          checked={useBusiness}
          disabled={!hasBusinessName}
          onCheckedChange={handleBusinessToggle}
        />
      </div>
      <div className='flex items-center justify-between gap-2'>
        <FormLabel htmlFor='tax-id-switch' className='flex items-center gap-1'>
          Tax ID
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleAlert className='text-muted-foreground size-4 shrink-0 cursor-pointer' />
            </TooltipTrigger>
            <TooltipContent>
              Use your saved Tax ID from account settings
            </TooltipContent>
          </Tooltip>
        </FormLabel>
        <Switch
          id='tax-id-switch'
          checked={useTaxId}
          disabled={!hasTaxId}
          onCheckedChange={handleTaxIdToggle}
        />
      </div>
      <div className='flex items-center justify-between gap-2'>
        <FormLabel htmlFor='address-switch'>Address</FormLabel>
        <Switch
          id='address-switch'
          checked={useAddress}
          disabled={!hasAddress}
          onCheckedChange={handleAddressToggle}
        />
      </div>
    </div>
  );
};
