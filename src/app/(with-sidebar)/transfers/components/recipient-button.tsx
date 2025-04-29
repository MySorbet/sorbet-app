import { ChevronRight, Landmark, Wallet } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Root component for the recipient button. Compose with other `RecipientButton` components
 * @see storybook for examples of how to compose
 */
export const RecipientButton = ({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <button
      className={cn(
        'bg-primary-foreground border-neutral-lighter hover:bg-primary-foreground/50 group flex min-w-56 justify-between gap-3 rounded-lg border p-3',
        className
      )}
      onClick={onClick}
      type='button'
    >
      {children}
      <ChevronRight className='text-muted-foreground size-6 shrink-0 transition-transform duration-200 ease-in-out group-hover:translate-x-1' />
    </button>
  );
};

/** Content component for the recipient button. */
export const RecipientButtonContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className='space-y-1 text-left'>{children}</div>;
};

/** Title of a recipient button. Render inside `RecipientButtonContent`. */
export const RecipientButtonTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className='text-sm font-semibold'>{children}</p>;
};

/** Description of a recipient button. Render inside `RecipientButtonContent`. */
export const RecipientButtonDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className='text-muted-foreground text-sm'>{children}</p>;
};

/** Icon of a recipient button. Render outside `RecipientButton`. */
export const RecipientButtonIcon = ({ type }: { type: 'bank' | 'wallet' }) => {
  return (
    <div className='bg-neutral-lighter flex size-10 shrink-0 items-center justify-center rounded-full p-2'>
      {type === 'bank' ? (
        <Landmark className='size-5' />
      ) : (
        <Wallet className='size-5' />
      )}
    </div>
  );
};

/** Detail of a recipient button. Render inside `RecipientButtonContent`. */
export const RecipientButtonDetail = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className='text-sorbet-blue pt-2 text-xs'>{children}</div>;
};
