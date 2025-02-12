import React from 'react';

import { Authenticated } from '../../authenticated';
import { TransactionsBrowser } from '../components/transactions-browser';

export default function WalletAllPage() {
  return (
    <Authenticated>
      <TransactionsBrowser />
    </Authenticated>
  );
}
