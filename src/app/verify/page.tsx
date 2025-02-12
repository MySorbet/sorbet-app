import { Header } from '@/components/header';

import { Authenticated } from '../authenticated';
import { VerifyDashboard } from './components/verify-dashboard';

export default function VerifyPage() {
  return (
    <Authenticated>
      <main className='bg-background flex w-full flex-col'>
        <Header />
        <div className='container flex flex-1 justify-center p-8'>
          <VerifyDashboard />
        </div>
      </main>
    </Authenticated>
  );
}
