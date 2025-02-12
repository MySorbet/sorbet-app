import { Metadata } from 'next';

import { Header } from '@/components/header';

import { Authenticated } from '../authenticated';
import { Dashboard } from './components/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <Authenticated>
      <div className='flex w-full flex-col'>
        <Header />
        <main className='bg-background container flex flex-col items-center p-8'>
          <Dashboard />
        </main>
      </div>
    </Authenticated>
  );
}
