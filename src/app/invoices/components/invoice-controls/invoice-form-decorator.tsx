import { zodResolver } from '@hookform/resolvers/zod';
import type { StoryFn } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';

import {
  type InvoiceForm,
  defaultInvoiceValues,
  invoiceFormSchema,
} from '../../schema';

export const InvoiceFormDecorator = (Story: StoryFn) => {
  const form = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: defaultInvoiceValues,
  });
  return (
    <Form {...form}>
      <Story />
    </Form>
  );
};
