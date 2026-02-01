import { Metadata } from 'next';

import { Authenticated } from '@/app/authenticated';
import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { AccountsPageContent } from './components/accounts-page-content';

export const metadata: Metadata = {
  title: 'Accounts',
};

export default function AccountsPage() {
  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <Page.Content>
          <AccountsPageContent />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
