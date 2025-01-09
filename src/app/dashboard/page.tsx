import Authenticated from '@/app/authenticated';
import { Header } from '@/components/header';

import { Dashboard } from './components/dashboard';

export default function DashboardPage() {
  return (
    <Authenticated>
      <main className='flex size-full flex-col'>
        <Header />
        <div className='container flex flex-1 justify-center pt-6'>
          <Dashboard />
        </div>
      </main>
    </Authenticated>
  );
}
