import { Metadata } from 'next';

import { Authenticated } from '@/app/authenticated';
import { DocsButton } from '@/components/common/docs-button';
import { Header } from '@/components/common/header';
import Page from '@/components/common/page';
import { Header as AppHeader } from '@/components/header/header';

import { AccountsPageContent } from './components/accounts-page-content';

export const metadata: Metadata = {
  title: 'Accounts',
};

export default function AccountsPage() {
  return (
    <Authenticated>
      <Page.Main>
        <AppHeader />
        <Header
          title='Accounts'
          subtitle='Receive USD and EUR payments from your customers'
        >
          <DocsButton />
        </Header>
        <Page.Content>
          <AccountsPageContent />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
