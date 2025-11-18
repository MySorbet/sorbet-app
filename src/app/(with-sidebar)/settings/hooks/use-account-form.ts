import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useAuth } from '@/hooks';
import { getInvoicingDetails, updateInvoicingDetails } from '@/api/invoicing';

import { accountSchema, type AccountFormData } from '../schemas';

export const useAccountForm = () => {
  const { user } = useAuth();

  // Fetch existing invoicing details
  const { data: invoicingData } = useQuery({
    queryKey: ['invoicing', user?.id],
    queryFn: () => getInvoicingDetails(user!.id),
    enabled: !!user?.id,
  });

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      businessName: '',
      taxId: '',
      street: '',
      state: '',
      addressCity: '',
      country: '',
      postalCode: '',
    },
    mode: 'onTouched',
  });

  // Update form when data loads
  useEffect(() => {
    if (invoicingData) {
      form.reset({
        businessName: invoicingData.businessName ?? '',
        taxId: invoicingData.taxId ?? '',
        street: invoicingData.street ?? '',
        state: invoicingData.state ?? '',
        addressCity: invoicingData.city ?? '',
        country: invoicingData.country ?? '',
        postalCode: invoicingData.postalCode ?? '',
      });
    }
  }, [invoicingData, form]);

  const updateMutation = useMutation({
    mutationFn: (data: AccountFormData) =>
      updateInvoicingDetails(user!.id, {
        ...data,
        city: data.addressCity,
      }),
    onSuccess: (data) => {
      form.reset({
        businessName: data.businessName ?? '',
        taxId: data.taxId ?? '',
        street: data.street ?? '',
        state: data.state ?? '',
        addressCity: data.city ?? '',
        country: data.country ?? '',
        postalCode: data.postalCode ?? '',
      });
      toast.success('Invoicing details updated');
    },
    onError: () => {
      toast.error('Failed to update invoicing details');
    },
  });

  const { isDirty, isValid } = form.formState;

  const onSubmit = async (formData: AccountFormData) => {
    if (!user?.id) {
      toast.error('Unable to update account details');
      return;
    }
    await updateMutation.mutateAsync(formData);
  };

  const handleCancel = () => {
    form.reset();
  };

  return {
    form,
    onSubmit,
    handleCancel,
    isDirty,
    isValid,
    isUpdating: updateMutation.isPending,
  };
};


