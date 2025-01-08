import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { DashboardCard } from './dashboard-card';

/** Main card for the dashboard with a welcome message and call to action buttons */
export const WelcomeCard = ({
  name,
  onCreateInvoice,
  onClickLinkInBio,
  className,
}: {
  name?: string;
  onCreateInvoice?: () => void;
  onClickLinkInBio?: () => void;
  className?: string;
}) => {
  const title = name ? `Welcome, ${name}` : 'Welcome to Sorbet';
  return (
    <DashboardCard className={cn('@container w-full', className)}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-2'>
          <h2 className=' text-wrap break-words text-2xl font-semibold'>
            {title}
          </h2>
          <p className='text-sm'>
            Introducing the global payment experience for freelancers. Complete
            onboarding tasks to get started on your Sorbet journey.
          </p>
        </div>

        <div className='flex flex-row flex-wrap gap-3'>
          <Button
            variant='sorbet'
            onClick={onCreateInvoice}
            className='@xs:max-w-36 w-full'
          >
            Create Invoice
          </Button>
          <Button
            variant='secondary'
            onClick={onClickLinkInBio}
            className='@xs:max-w-36 w-full'
          >
            Link-in-Bio
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};
