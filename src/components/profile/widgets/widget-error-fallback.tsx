import { AlertCircle } from 'lucide-react';
import { FallbackProps } from 'react-error-boundary';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * A fallback component to be passed to `<ErrorBoundary/>` that is displayed when an error occurs in the widget.
 *
 * It renders an alert with an error message and a button to reset the error boundary and rerender the UI inside of the `<ErrorBoundary/>`.
 */
export const WidgetErrorFallback: React.ComponentType<FallbackProps> = ({
  resetErrorBoundary,
}) => {
  return (
    <Alert
      variant='destructive'
      className='bg-background shadow-card h-full w-full rounded-3xl'
    >
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Whoops</AlertTitle>
      <AlertDescription>Something broke. Please try again.</AlertDescription>
      <div className='flex`'>
        <Button
          variant='outline'
          onClick={() => resetErrorBoundary()}
          className='mt-2'
        >
          Try again
        </Button>
      </div>
    </Alert>
  );
};
