import { Metadata } from 'next';

import { Authenticated } from '../authenticated';
import { Dashboard } from './components/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <Authenticated>
      <main className='bg-background flex size-full flex-col'>
        <div className='bg-background container flex flex-1 justify-center py-6'>
          <Dashboard />
        </div>
      </main>
    </Authenticated>
  );
}
