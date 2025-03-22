import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { Authenticated } from '../../authenticated';
import { VerifyDashboard } from './components/verify-dashboard';

export default function VerifyPage() {
  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <Page.Content>
          <VerifyDashboard />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
