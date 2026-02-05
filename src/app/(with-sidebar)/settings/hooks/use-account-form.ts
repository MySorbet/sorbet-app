import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { getInvoicingDetails, updateInvoicingDetails } from '@/api/invoicing';
import { useAuth } from '@/hooks';

import { type AccountFormData, accountSchema } from '../schemas';

export const useAccountForm = () => {
  const { user } = useAuth();
  const userId = user?.id;

  // Fetch existing invoicing details
  const { data: invoicingData } = useQuery({
    queryKey: ['invoicing', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Missing user id');
      return getInvoicingDetails(userId);
    },
    enabled: Boolean(userId),
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
    mutationFn: async (data: AccountFormData) => {
      if (!userId) throw new Error('Missing user id');
      return updateInvoicingDetails(userId, {
        ...data,
        city: data.addressCity,
      });
    },
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
