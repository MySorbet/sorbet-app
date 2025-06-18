import { CheckCircleIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { useBridgeCustomer } from '@/hooks/profile/use-bridge-customer';
import { useFlags } from '@/hooks/use-flags';
import { cn } from '@/lib/utils';

import { UploadProofOfAddress } from './upload-proof-of-address';

/** Temporary card just to show the status of the endorsements and POA upload */
export const YourEndorsements = () => {
  const { data: customer } = useBridgeCustomer();
  const { yourEndorsements } = useFlags();

  if (!yourEndorsements) {
    return null;
  }

  const eurStatus = customer?.customer.endorsements.find(
    (e) => e.name === 'sepa'
  )?.status;
  const baseStatus = customer?.customer.endorsements.find(
    (e) => e.name === 'base'
  )?.status;

  const isBaseApproved = baseStatus === 'approved';
  const isEurApproved = eurStatus === 'approved';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Endorsements</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='space-y-1'>
          <p className='font-medium'>USD</p>
          <p className='text-muted-foreground text-sm'>
            Your ability to accept USD deposits and send USD to recipients.
          </p>
          <Badge
            className='flex w-fit items-center gap-2 text-sm'
            variant={isBaseApproved ? 'success' : 'outline'}
          >
            {isBaseApproved && (
              <CheckCircleIcon className='size-4 text-green-500' />
            )}
            <span
              className={cn(
                'text-muted-foreground text-sm',
                isBaseApproved && 'text-green-500'
              )}
            >
              {baseStatus}
            </span>
          </Badge>
        </div>
        <div className='space-y-1'>
          <p className='font-medium'>EUR</p>
          <p className='text-muted-foreground text-sm'>
            Your ability to accept EUR deposits and send EUR to recipients.
          </p>
          <Badge
            className='flex w-fit items-center gap-2 text-sm'
            variant={isEurApproved ? 'success' : 'outline'}
          >
            {isEurApproved && (
              <CheckCircleIcon className='size-4 text-green-500' />
            )}
            <span
              className={cn(
                'text-muted-foreground text-sm',
                isEurApproved && 'text-green-500'
              )}
            >
              {eurStatus}
            </span>
          </Badge>
        </div>
        <UploadProofOfAddress />
      </CardContent>
    </Card>
  );
};
