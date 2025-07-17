'use client';

import { Header as CommonHeader } from '@/components/common/header';
import Page from '@/components/common/page';
import { Header } from '@/components/header';

import { Authenticated } from '../../authenticated';
import { SettingsDashboard } from './components/settings-dashboard';

const SettingsPage = () => {
  return (
    <Authenticated>
      <Page.Main>
        <Header />
        <CommonHeader title='Settings'></CommonHeader>
        <Page.Content>
          <SettingsDashboard />
        </Page.Content>
      </Page.Main>
    </Authenticated>
  );
};

export default SettingsPage;
