import { ClientDetails } from './client-details';
import { InvoiceDetails } from './invoice-details';
import { PaymentDetails } from './payment-details';

type CreateInvoiceProps = {
  step: number;
  name: string;
  email: string;
  invoiceNumber: string;
};

export const CreateInvoice: React.FC<CreateInvoiceProps> = ({
  step,
  name,
  email,
  invoiceNumber,
}) => {
  return (
    <div className='flex min-w-96 max-w-screen-md flex-col gap-4'>
      {step === 1 ? <ClientDetails name={name} email={email} /> : null}
      {step === 2 ? <InvoiceDetails invoiceNumber={invoiceNumber} /> : null}
      {step === 3 ? <PaymentDetails /> : null}
    </div>
  );
};
