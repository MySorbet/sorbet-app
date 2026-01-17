import { Authenticated } from '@/app/authenticated';
import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { TransactionsBrowser } from '../components/transactions-browser';

export default function WalletAllPage() {
  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <Page.Content>
          <TransactionsBrowser />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
