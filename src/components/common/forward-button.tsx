import { ArrowRight } from '@untitled-ui/icons-react';

import { Spinner } from '@/components/common/spinner';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ForwardButtonProps = ButtonProps & {
  /** Whether the button is in a loading state */
  isLoading?: boolean;
};

/**
 * A sorbet variant 'submit' button that renders with an animated right arrow icon
 *
 * Can render an animated loading state
 */
export const ForwardButton = ({
  children,
  className,
  disabled,
  isLoading,
  ...props
}: ForwardButtonProps) => {
  return (
    <Button
      variant='sorbet'
      type='submit'
      disabled={isLoading || disabled}
      className={cn('group', className)}
      {...props}
    >
      {isLoading ? (
        <>
          Creating
          <div className='animate-in fade-in-0 zoom-in-0'>
            <Spinner />
          </div>
        </>
      ) : (
        <>
          {children}
          <ArrowRight className='animate-in fade-in-0 zoom-in-0 h-4 w-4 transition-transform group-hover:translate-x-1' />
        </>
      )}
    </Button>
  );
};
