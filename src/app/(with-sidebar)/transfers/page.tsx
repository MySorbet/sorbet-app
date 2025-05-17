import { Authenticated } from '@/app/authenticated';
import { Header } from '@/components/common/header';
import Page from '@/components/common/page';

import { RecipientPageContent } from './components/recipient-page-content';

export default function TransfersPage() {
  return (
    <Authenticated>
      <Page.Main>
        <Header title='Transfers' />
        <Page.Content>
          <RecipientPageContent />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
