import Image from 'next/image';

/**
 * General error fallback component to be used as a catchall and fallback for 404.
 * Render your own action button as a child
 * TODO: Consider adding a collapsable details section to render error messages or digests.
 */
export const ErrorFallback = ({
  type = 'generic',
  children,
}: {
  type?: 'not-found' | 'generic';
  children?: React.ReactNode;
}) => {
  return (
    <div className='container flex max-w-96 flex-col items-center justify-center gap-6'>
      <Image
        src='/svg/dropped-cone.svg'
        alt='Dropped ice cream cone'
        className='size-28'
        width={112}
        height={112}
        priority
      />
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-semibold'>Oops!</h1>
        <p className='text-muted-foreground'>
          {type === 'not-found'
            ? 'The page you are looking for does not exist.'
            : 'Something went wrong. Please try again.'}
        </p>
      </div>
      {children}
    </div>
  );
};
