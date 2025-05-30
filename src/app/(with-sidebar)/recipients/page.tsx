import { Authenticated } from '@/app/authenticated';
import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { RecipientPageContent } from './components/recipient-page-content';
import { RecipientsHeader } from './components/recipients-header';

export default function RecipientsPage() {
  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <RecipientsHeader />
        <Page.Content>
          <RecipientPageContent />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
