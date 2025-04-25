import { Header } from '@/components/common/header';
import Page from '@/components/common/page';

import { Authenticated } from '../../authenticated';
import { RecipientsCard } from './components/recipients-card';

export default function TransfersPage() {
  return (
    <Authenticated>
      <Page.Main>
        <Header title='Transfers' />
        <Page.Content>
          <RecipientsCard />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
