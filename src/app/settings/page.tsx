'use client';

import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { Authenticated } from '../authenticated';
import { SettingsDashboard } from './components/settings-dashboard';

const SettingsPage = () => {
  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <Page.Content>
          <SettingsDashboard />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
};

export default SettingsPage;
