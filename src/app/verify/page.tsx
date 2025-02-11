import Authenticated from '@/app/authenticated';

import { VerifyDashboard } from './components/verify-dashboard';

export default function VerifyPage() {
  return (
    <Authenticated>
      <main className='bg-background flex size-full flex-col'>
        <div className='bg-background container flex flex-1 justify-center py-6'>
          <VerifyDashboard />
        </div>
      </main>
    </Authenticated>
  );
}
