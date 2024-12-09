import { Meta } from '@storybook/react';

import { CreditCardForm } from './credit-card';

const meta = {
  title: 'Wallet/Credit Card',
  component: CreditCardForm,
} satisfies Meta<typeof CreditCardForm>;

export default meta;

export const Default = () => <CreditCardForm />;
