import { Button } from '@/components/ui/button';

import { DashboardCard } from './dashboard-card';

/** Main card for the dashboard with a welcome message and call to action buttons */
export const WelcomeCard = ({
  name,
  onCreateInvoice,
  onClickLinkInBio,
}: {
  name: string;
  onCreateInvoice?: () => void;
  onClickLinkInBio?: () => void;
}) => {
  return (
    <DashboardCard className='w-full'>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-2'>
          <h2 className=' text-wrap break-words text-2xl font-semibold'>
            Welcome, {name}
          </h2>
          <p className='text-sm'>
            Introducing the global payment experience for freelancers. Complete
            onboarding tasks to get started on your Sorbet journey.
          </p>
        </div>

        <div className='flex gap-3'>
          <Button variant='sorbet' onClick={onCreateInvoice}>
            Create Invoice
          </Button>
          <Button variant='secondary' onClick={onClickLinkInBio}>
            Link-in-Bio
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};
