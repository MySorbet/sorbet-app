import { Authenticated } from '@/app/authenticated';
import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { RecipientsBrowser } from './components/recipients-browser';

export default function RecipientsPage() {
  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <Page.Content>
          <RecipientsBrowser />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
