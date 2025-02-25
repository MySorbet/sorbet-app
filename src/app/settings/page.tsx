'use client';

import { Header } from '@/components/header';

import { Authenticated } from '../authenticated';
import { SettingsDashboard } from './components/settings-dashboard';

const SettingsPage = () => {
  return (
    <Authenticated>
      <main className='bg-background flex w-full flex-col'>
        <Header />
        <div className='container flex flex-1 justify-center p-8'>
          <SettingsDashboard />
        </div>
      </main>
    </Authenticated>
  );
};

export default SettingsPage;
