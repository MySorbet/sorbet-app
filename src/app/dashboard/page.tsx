import { Header } from '@/components/header';

import { Dashboard } from './components/dashboard';

export default function DashboardPage() {
  return (
    <main className='flex size-full flex-col'>
      <Header />
      <div className='container flex flex-1 justify-center pt-14'>
        <Dashboard />
      </div>
    </main>
  );
}
