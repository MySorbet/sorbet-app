import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * Warn users that editing widgets is only supported on desktop currently.
 *
 * Only shown on on on viewports smaller than `md`.
 */
export const DesktopOnlyAlert = () => {
  return (
    <Alert className='border-orange-700 bg-orange-100 text-orange-700 md:hidden [&>svg]:text-orange-700'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Important</AlertTitle>
      <AlertDescription>
        You can only edit widgets on desktop to ensure best experience.
      </AlertDescription>
    </Alert>
  );
};
