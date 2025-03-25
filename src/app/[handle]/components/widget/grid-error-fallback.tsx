import { AlertCircle } from 'lucide-react';
import { FallbackProps } from 'react-error-boundary';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * A fallback component to be passed to `<ErrorBoundary/>` that is displayed when an error occurs in the widget grid.
 *
 * It renders an alert with an error message and a button to reset the error boundary and rerender the UI inside of the `<ErrorBoundary/>`.
 */
export const GridErrorFallback: React.ComponentType<FallbackProps> = () => {
  return (
    <div className='flex size-full items-center justify-center'>
      <Alert variant='destructive' className='w-fit'>
        <AlertCircle className='size-4' />
        <AlertTitle>Whoops</AlertTitle>
        <AlertDescription>
          Something broke. Let's try this again.
        </AlertDescription>
        <div className='flex`'>
          <Button
            variant='secondary'
            onClick={() => {
              // So far, the only known issue repo is
              // add a widget, move another into its place while the api call to create it has not returned, then drop the widget you are holding
              // in the rgl map, the widget cannot be found when the layout tries to update.
              // We mitigated this by returning null for now. So there are no known cases when this renders
              window.location.reload();
            }}
            className='mt-2'
          >
            Refresh
          </Button>
        </div>
      </Alert>
    </div>
  );
};
