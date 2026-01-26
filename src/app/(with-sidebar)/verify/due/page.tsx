import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { Authenticated } from '../../../authenticated';
import { DueVerifyDashboard } from './components/due-verify-dashboard';

export default function DueVerifyPage() {
  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <Page.Content>
          <DueVerifyDashboard />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
