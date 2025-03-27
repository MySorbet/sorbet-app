import { Link } from 'lucide-react';
import React from 'react';
import { parseURL } from 'ufo';

import { InlineEdit } from '@/components/common/inline-edit/inline-edit';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { WidgetData, WidgetSize } from './grid-config';
import { ImageWidget } from './image-widget';
import { SocialIcon } from './social-icon';
import { getUrlType } from './url-util';

type WidgetProps = Omit<WidgetData, 'id'> & {
  loading?: boolean;
  size: WidgetSize;
  editable?: boolean;
  onUpdate?: (data: Partial<WidgetData>) => void;
};

/**
 * The most basic component to display a widget as an anchor tag styled as a card.
 * - Displays a title, icon image, and content image.
 * - The idea is to pass a temp title (like url) and loading=true to display a loading state while creating the widget in the backend (i.e. grabbing favicon, og:image, etc.)
 * - Then pass a new title (website title), iconUrl (favicon), and contentUrl (og:image) to display the actual widget.
 *
 * Widgets will fill their container's width and height (up to a max of 390x390px)
 * They are expected to be rendered in a container with a width and height corresponding to the the `size` prop.
 */
export const Widget = ({
  iconUrl,
  title,
  userTitle,
  contentUrl,
  href,
  loading = false,
  type,
  size = 'A',
  editable = false,
  onUpdate,
}: WidgetProps) => {
  if (type === 'image') {
    return (
      <ImageWidget
        contentUrl={contentUrl}
        className='animate-in fade-in-0 zoom-in-0 max-h-[390px] max-w-[390px] select-none duration-300'
        loading={loading}
      />
    );
  }

  const urlType = href && getUrlType(href);

  // This is the title of the widget if the user has not explicitly set a title.
  // If the user has set userTitle, it will be preferred. If they clear that, we will fall back to this.
  const fallbackTitle = title || parseURL(href).host || href || '';

  return (
    <a
      className={cn(
        'bg-card text-card-foreground flex select-none flex-col overflow-hidden rounded-2xl border shadow-sm',
        size === 'D' && 'flex-row',
        'size-full max-h-[390px] max-w-[390px]',
        'animate-in fade-in-0 zoom-in-0 duration-300' // Always have an enter animation. We hide the first one with a full grid fade anyway.
      )}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      draggable={false} // disable HTML5 dnd
      // TODO: Consider allowing dragging links to other programs with ondragstart="event.dataTransfer.setData('text/plain', href)">
    >
      <CardHeader className={cn('space-y-1', size === 'D' && 'max-w-[60%]')}>
        {urlType ? (
          <SocialIcon type={urlType} />
        ) : loading ? (
          <Skeleton className='size-10' />
        ) : (
          <Icon src={iconUrl} />
        )}
        <CardTitle className={cn('text-sm font-normal')}>
          <InlineEdit
            value={userTitle || fallbackTitle}
            editable={editable}
            onChange={(value) => {
              onUpdate?.({ userTitle: value === '' ? null : value }); // If the user clears the title, set it to null to explicitly clear it
            }}
            placeholder={fallbackTitle}
            className={cn(
              'line-clamp-3 break-words',
              editable &&
                'hover:bg-muted -ml-2 rounded-sm px-2 py-1 transition-colors duration-200'
            )}
          />
        </CardTitle>
      </CardHeader>
      {/* TODO: Perhaps you could extract all the size conditionals to this container? */}
      <CardContent
        className={cn(
          'flex flex-1 items-end justify-end',
          size === 'D' && 'pl-0 pt-6'
        )}
      >
        {size !== 'B' && (
          <>
            {loading ? (
              <Skeleton
                className={cn(
                  size === 'A' && 'aspect-[1200/630] w-full', // common og image aspect
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
                  size === 'A' && 'aspect-[1200/630] w-full', // common og image aspect
                  // B doesn't have a content image
                  size === 'C' && 'aspect-square w-full',
                  size === 'D' && 'aspect-square h-full'
                )}
              />
            ) : (
              <ContentPlaceholder
                className={cn(
                  size === 'A' && 'aspect-[1200/630] w-full',
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
          className={cn(
            'size-full',
            'rounded-sm', // opt all favicons in to a litttle bit of rounding
            className
          )}
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

const ContentPlaceholder = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...rest }, ref) => {
  return (
    <div
      className={cn(
        'bg-muted text-muted-foreground group flex items-center justify-center rounded-md border p-2 text-center text-sm font-normal',
        className
      )}
      ref={ref}
      {...rest}
    >
      <p className='opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
        We couldn't find a preview for this link
      </p>
    </div>
  );
});
