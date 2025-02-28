import { Metadata } from 'next';

import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { Authenticated } from '../authenticated';
import { Dashboard } from './components/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <Page.Content>
          <Dashboard />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
}
