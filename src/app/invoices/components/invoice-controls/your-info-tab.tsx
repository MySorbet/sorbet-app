'use client';

import { Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import {
  deleteInvoiceLogoAsync,
  uploadInvoiceLogoAsync,
} from '@/api/images';
import { type InvoicingDetails, getInvoicingDetails } from '@/api/invoicing';
import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks';

import { useInvoiceForm } from '../../hooks/use-invoice-form';

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'AE', label: 'United Arab Emirates' },
] as const;

/**
 * The 2nd tab of the invoice controls, "Your info"
 * - Renders sender details with optional business name, tax ID, logo, and address
 * - Business name toggle (Option A): when ON, its value overrides fromName on the invoice
 * - Manipulates form data via `useInvoiceForm`
 */
export const YourInfoTab = ({ onNext }: { onNext: () => void }) => {
  const form = useInvoiceForm();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [invoicingDetails, setInvoicingDetails] =
    useState<InvoicingDetails | null>(null);

  // Personal name is tracked separately so it can be restored when business toggle is turned off
  const [personalName, setPersonalName] = useState('');

  const [useBusiness, setUseBusiness] = useState(false);
  const [businessNameValue, setBusinessNameValue] = useState('');

  const [useTaxId, setUseTaxId] = useState(false);
  const [taxIdValue, setTaxIdValue] = useState('');

  const [useAddress, setUseAddress] = useState(false);
  const [addressValues, setAddressValues] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zip: '',
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getInvoicingDetails(user.id)
        .then((details) => {
          setInvoicingDetails(details);
          if (details?.logoUrl) {
            setLogoUrl(details.logoUrl);
            form.setValue('logoUrl', details.logoUrl);
          }
        })
        .catch(console.error);
    }
  }, [user?.id, form]);

  const handlePersonalNameChange = (value: string) => {
    setPersonalName(value);
    if (!useBusiness) {
      form.setValue('fromName', value, { shouldValidate: true });
    }
  };

  const handleBusinessToggle = (checked: boolean) => {
    setUseBusiness(checked);
    if (checked) {
      const name = invoicingDetails?.businessName ?? '';
      setBusinessNameValue(name);
      form.setValue('fromName', name, { shouldValidate: true });
    } else {
      form.setValue('fromName', personalName, { shouldValidate: true });
    }
  };

  const handleBusinessNameChange = (value: string) => {
    setBusinessNameValue(value);
    form.setValue('fromName', value, { shouldValidate: true });
  };

  const handleTaxIdToggle = (checked: boolean) => {
    setUseTaxId(checked);
    if (checked) {
      const taxId = invoicingDetails?.taxId ?? '';
      setTaxIdValue(taxId);
      form.setValue('taxId', taxId);
    } else {
      form.setValue('taxId', undefined);
    }
  };

  const handleAddressToggle = (checked: boolean) => {
    setUseAddress(checked);
    if (checked) {
      const prefilled = {
        street: invoicingDetails?.street ?? '',
        city: invoicingDetails?.city ?? '',
        state: invoicingDetails?.state ?? '',
        country: invoicingDetails?.country ?? '',
        zip: invoicingDetails?.postalCode ?? '',
      };
      setAddressValues(prefilled);
      const hasAnyValue = Object.values(prefilled).some(Boolean);
      form.setValue('address', hasAnyValue ? prefilled : undefined);
    } else {
      form.setValue('address', undefined);
    }
  };

  const handleAddressFieldChange = (
    field: keyof typeof addressValues,
    value: string
  ) => {
    const updated = { ...addressValues, [field]: value };
    setAddressValues(updated);
    form.setValue('address', updated);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', file.type);
      formData.append('userId', user.id);
      if (logoUrl) formData.append('oldLogoUrl', logoUrl);

      const { data } = await uploadInvoiceLogoAsync(formData);
      setLogoUrl(data.fileUrl);
      form.setValue('logoUrl', data.fileUrl);
    } catch (error) {
      console.error('Failed to upload logo:', error);
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogoDelete = async () => {
    if (!user?.id) return;
    try {
      await deleteInvoiceLogoAsync(user.id);
      setLogoUrl(null);
      form.setValue('logoUrl', undefined);
    } catch (error) {
      console.error('Failed to delete logo:', error);
    }
  };

  const handleNextClick = async () => {
    const isValid = await form.trigger(['fromName', 'fromEmail']);
    if (isValid) onNext();
  };

  const fromNameError = form.formState.errors.fromName?.message;

  return (
    <div className='flex flex-col gap-6'>
      {/* Your name */}
      <div className='flex flex-col gap-1.5'>
        <FormLabel>Your name</FormLabel>
        <Input
          placeholder='Add name'
          value={personalName}
          onChange={(e) => handlePersonalNameChange(e.target.value)}
        />
        {fromNameError && !useBusiness && (
          <p className='text-destructive text-sm'>{fromNameError}</p>
        )}
      </div>

      {/* Email */}
      <FormField
        name='fromEmail'
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type='email' placeholder='Add email' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Business name */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between gap-2'>
          <FormLabel>Business name</FormLabel>
          <Switch
            checked={useBusiness}
            disabled={!invoicingDetails?.businessName}
            onCheckedChange={handleBusinessToggle}
          />
        </div>
        {useBusiness && (
          <div className='animate-in fade-in-0 slide-in-from-top-2 flex flex-col gap-1.5'>
            <Input
              placeholder='Business name'
              value={businessNameValue}
              onChange={(e) => handleBusinessNameChange(e.target.value)}
            />
            {fromNameError && (
              <p className='text-destructive text-sm'>{fromNameError}</p>
            )}
          </div>
        )}
      </div>

      {/* Tax ID */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between gap-2'>
          <FormLabel className='flex items-center gap-1'>
            Tax ID
            <InfoTooltip>
              Use your saved Tax ID from account settings
            </InfoTooltip>
          </FormLabel>
          <Switch
            checked={useTaxId}
            disabled={!invoicingDetails?.taxId}
            onCheckedChange={handleTaxIdToggle}
          />
        </div>
        {useTaxId && (
          <Input
            placeholder='Tax ID'
            value={taxIdValue}
            onChange={(e) => {
              setTaxIdValue(e.target.value);
              form.setValue('taxId', e.target.value);
            }}
            className='animate-in fade-in-0 slide-in-from-top-2'
          />
        )}
      </div>

      {/* Logo */}
      <Card className='flex flex-col gap-3 p-4'>
        <FormLabel>Logo (optional)</FormLabel>
        {logoUrl ? (
          <div className='flex items-center justify-between'>
            <Image
              src={logoUrl}
              alt='Invoice logo'
              width={56}
              height={56}
              className='h-14 w-14 rounded-md object-cover'
            />
            <div className='flex items-center gap-1'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                disabled={isUploadingLogo}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className='h-4 w-4 text-muted-foreground' />
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                disabled={isUploadingLogo}
                onClick={handleLogoDelete}
              >
                <Trash2 className='h-4 w-4 text-muted-foreground' />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type='button'
            disabled={isUploadingLogo}
            onClick={() => fileInputRef.current?.click()}
            className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-muted-foreground transition-colors hover:bg-muted/50 disabled:opacity-50'
          >
            <Upload className='h-5 w-5' />
            <span className='text-sm'>
              {isUploadingLogo
                ? 'Uploading...'
                : 'Upload logo to be displayed on invoices'}
            </span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleLogoUpload}
        />
      </Card>

      {/* Address */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between gap-2'>
          <FormLabel>Address</FormLabel>
          <Switch checked={useAddress} onCheckedChange={handleAddressToggle} />
        </div>
        {useAddress && (
          <div className='animate-in fade-in-0 slide-in-from-top-2 flex flex-col gap-2'>
            <Input
              placeholder='Street'
              value={addressValues.street}
              onChange={(e) => handleAddressFieldChange('street', e.target.value)}
            />
            <div className='flex gap-2'>
              <Input
                placeholder='State'
                value={addressValues.state}
                onChange={(e) =>
                  handleAddressFieldChange('state', e.target.value)
                }
              />
              <Input
                placeholder='City'
                value={addressValues.city}
                onChange={(e) =>
                  handleAddressFieldChange('city', e.target.value)
                }
              />
            </div>
            <Select
              value={addressValues.country}
              onValueChange={(value) =>
                handleAddressFieldChange('country', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Country' />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder='Postal code'
              value={addressValues.zip}
              onChange={(e) => handleAddressFieldChange('zip', e.target.value)}
            />
          </div>
        )}
      </div>

      <Button
        type='button'
        className='w-full p-6 text-base font-semibold bg-[#7c3aed] hover:bg-[#6d28d9]'
        onClick={handleNextClick}
      >
        Save & Next
      </Button>
    </div>
  );
};
