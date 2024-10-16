'use client';

import { useRouter } from 'next/navigation';

import { useToast } from '../../../../components/ui/use-toast';
import { useInvoiceFormContext } from '../../components/create/invoice-form-context';
import { InvoicePDFRender } from '../../components/invoice-pdf-render';

export default function ReviewPage() {
  const { formData } = useInvoiceFormContext();
  const router = useRouter();
  const { toast } = useToast();
  return (
    <InvoicePDFRender
      invoice={formData}
      onBack={() => router.back()}
      onCreate={() => {
        toast({
          title: 'Invoice created',
          description: 'Your invoice has been created',
        });
      }}
    />
  );
}
