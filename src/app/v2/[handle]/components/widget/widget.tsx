import { Link } from 'lucide-react';
import React from 'react';

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * The most basic component to display a widget as an anchor tag styled as a card.
 * - Displays a title, icon image, and content image.
 * - The idea is to pass a temp title (like url) and loading=true to display a loading state while creating the widget in the backend (i.e. grabbing favicon, og:image, etc.)
 * - Then pass a new title (website title), iconUrl (favicon), and contentUrl (og:image) to display the actual widget.
 */
export const Widget = ({
  iconUrl,
  title,
  contentUrl,
  href,
  loading = false,
  size = 'A',
}: {
  iconUrl?: string;
  title: string;
  contentUrl?: string;
  href?: string;
  loading?: boolean;
  size?: 'A' | 'B' | 'C' | 'D';
}) => {
  return (
    <a
      className={cn(
        'bg-card text-card-foreground flex flex-col rounded-lg border shadow-sm',
        size === 'A' && 'aspect-square w-96',
        size === 'B' && 'aspect-square w-44',
        size === 'C' && 'h-96 w-44',
        size === 'D' && 'h-44 w-96 flex-row'
      )}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
    >
      <CardHeader className='pb-10'>
        {loading ? <Skeleton className='size-10' /> : <Icon src={iconUrl} />}
        <CardTitle className='text-sm font-normal'>{title}</CardTitle>
      </CardHeader>
      <CardContent
        className={cn(
          'flex flex-1 items-end justify-end',
          size === 'D' && 'pt-6'
        )}
      >
        {size !== 'B' && (
          <>
            {loading ? (
              <Skeleton
                className={cn(
                  size === 'A' && 'size-full',
                  size === 'C' && 'aspect-square w-full',
                  size === 'D' && 'aspect-square h-full'
                )}
              />
            ) : contentUrl ? (
              <img
                src={contentUrl}
                alt={title}
                className={cn(
                  'rounded-md object-cover',
                  size === 'A' && 'size-full',
                  // B doesn't have a content image
                  size === 'C' && 'aspect-square w-full',
                  size === 'D' && 'aspect-square h-full'
                )}
              />
            ) : (
              <NothingToSeeHere
                className={cn(
                  size === 'A' && 'size-full',
                  size === 'C' && 'aspect-square w-full',
                  size === 'D' && 'aspect-square h-full'
                )}
              />
            )}
          </>
        )}
      </CardContent>
    </a>
  );
};

/**
 * Local component to render a favicon.
 * - If `src` is not given, a default link icon will be rendered.
 */
const Icon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  className,
  ...rest
}) => {
  return (
    <div className='flex size-10 items-center justify-center rounded-md border p-2'>
      {src ? (
        <img
          className={cn('size-full', className)}
          src={src}
          alt='Icon for widget'
          {...rest}
        />
      ) : (
        // In the case of no src url, render a link icon.
        <Link className={cn('size-full', className)} />
      )}
    </div>
  );
};

const NothingToSeeHere = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...rest }, ref) => {
  return (
    <p
      className={cn(
        'bg-muted text-muted-foreground flex items-center justify-center rounded-md border p-2 text-center text-sm font-normal',
        className
      )}
      ref={ref}
      {...rest}
    >
      Nothing to see here
    </p>
  );
});
