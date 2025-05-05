import { userEvent, within } from '@storybook/test';
import { toast } from 'sonner';

import { sleep } from '@/lib/utils';

export const FillOutBankRecipientForm = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);

  // Fill bank name
  await userEvent.type(canvas.getByLabelText(/Bank name/i), 'Chase Bank');

  // Fill account owner name
  await userEvent.type(canvas.getByLabelText(/Account Owner/i), 'John Doe');

  // Skip account type

  // Fill account number
  await userEvent.type(canvas.getByLabelText(/Account Number/i), '123456789');

  // Fill routing number
  await userEvent.type(canvas.getByLabelText(/Routing Number/i), '987654321');

  // Fill address fields
  await userEvent.type(canvas.getByLabelText(/Street Line 1/i), '123 Main St');

  await userEvent.type(canvas.getByLabelText(/City/i), 'San Francisco');

  await userEvent.type(canvas.getByLabelText(/Postal Code/i), '94103');

  // TODO: State

  // Skip country

  // Submit the form
  await userEvent.click(canvas.getByRole('button', { name: /Save/i }));
};

export const debugToast = async (values: unknown) => {
  await sleep(1000);
  toast(
    <pre className='max-w-xs rounded-md bg-slate-950 p-4'>
      <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
    </pre>
  );
};
