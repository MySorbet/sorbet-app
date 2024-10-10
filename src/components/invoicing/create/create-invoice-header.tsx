import { Stepper } from './stepper';

export const CreateInvoiceHeader = ({
  children,
  step,
}: {
  children: React.ReactNode;
  step: number;
}) => {
  return (
    <div className='mb-4 flex items-center justify-between border-b border-gray-200 py-4'>
      <h2 className='text-2xl font-bold'>{children}</h2>
      <Stepper step={step} totalSteps={3} />
    </div>
  );
};
