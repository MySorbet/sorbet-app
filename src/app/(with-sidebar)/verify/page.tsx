import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { Authenticated } from '../../authenticated';
import { CountryNotRestricted } from '../../country-not-restricted';
import { VerifyDashboard } from './components/verify-dashboard';

export default function VerifyPage() {
  return (
    <Authenticated>
      <CountryNotRestricted>
        <Page.Main>
          <Header />
          <Page.Content>
            <VerifyDashboard />
          </Page.Content>
        </Page.Main>
      </CountryNotRestricted>
    </Authenticated>
  );
}
