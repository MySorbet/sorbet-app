import { useFormContext } from 'react-hook-form';

import { InvoiceForm } from '../schema';

/** Hook for accessing the invoice form context */
export const useInvoiceForm = () => useFormContext<InvoiceForm>();
