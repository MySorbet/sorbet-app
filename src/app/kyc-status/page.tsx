import { redirect } from 'next/navigation';

import Page from '@/components/common/page';

import { Authenticated } from '../authenticated';
import { CountryNotRestricted } from '../country-not-restricted';
import { KycStatusContent } from './components/kyc-status-content';

type KycStatus = 'success' | 'failed';

export default function KycStatusPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status as KycStatus | undefined;

  if (!status || !['success', 'failed'].includes(status)) {
    redirect('/verify');
  }

  return (
    <Authenticated>
      <CountryNotRestricted>
        <Page.Main className="flex min-h-screen items-center justify-center bg-white">
          <KycStatusContent status={status} />
        </Page.Main>
      </CountryNotRestricted>
    </Authenticated>
  );
}
