'use client';

import { Link } from 'lucide-react';
import React, { useState } from 'react';
import { parseURL } from 'ufo';

import { UpdateWidgetDto, WidgetData } from '@/api/widgets-v2';
import { ImageErrorFallback } from '@/app/[handle]/components/widget/image-error-fallback';
import { InlineEdit } from '@/components/common/inline-edit/inline-edit';
import { Spinner } from '@/components/common/spinner';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { getUrlType } from '../../util';
import { WidgetSize } from './grid-config';
import { ImageWidget } from './image-widget';
import { SocialIcon } from './social-icon';
import { ConnectedPreviewControls } from './widget-controls/preview-controls';

export type WidgetProps = Partial<WidgetData> & {
  loading?: boolean;
  previewLoading?: boolean;
  size: WidgetSize;
  editable?: boolean;
  onUpdate?: (data: UpdateWidgetDto) => void;
  showPlaceholder?: boolean;
  dragging?: boolean;
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
  loading = false,
  previewLoading = false,
  size = 'A',
  editable = false,
  dragging = false,
  onUpdate,
  showPlaceholder = true,
  id,
  ...props
}: WidgetProps) => {
  // We store widgets state as nullable for good reason.
  // So the easiest way to handle this is to just accept null and undefined props.
  // And convert here for convenience below.
  const {
    href,
    contentUrl,
    userContentUrl,
    hideContent,
    iconUrl,
    title,
    userTitle,
    type,
  } = {
    href: props.href ?? undefined,
    contentUrl: props.contentUrl ?? undefined,
    userContentUrl: props.userContentUrl ?? undefined,
    hideContent: props.hideContent ?? undefined,
    iconUrl: props.iconUrl ?? undefined,
    title: props.title ?? undefined,
    userTitle: props.userTitle ?? undefined,
    type: props.type ?? undefined,
  };

  const [isImageError, setIsImageError] = useState(false);

  if (type === 'image') {
    return (
      <ImageWidget
        contentUrl={contentUrl}
        href={href}
        className='animate-in fade-in-0 zoom-in-0 max-h-[390px] max-w-[390px] select-none duration-300'
        loading={loading}
      />
    );
  }

  const urlType = href && getUrlType(href);

  // This is the title of the widget if the user has not explicitly set a title.
  // If the user has set userTitle, it will be preferred. If they clear that, we will fall back to this.
  const fallbackTitle = title || parseURL(href).host || href || '';

  // userContentUrl overrides contentUrl, hideContent overrides both
  const _contentUrl = hideContent ? undefined : userContentUrl || contentUrl;

  const showPreviewControls =
    editable && id && size !== 'B' && size !== 'E' && type !== 'image';

  return (
    <a
      className={cn(
        'bg-card text-card-foreground flex select-none flex-col overflow-hidden rounded-2xl border shadow-sm',
        size === 'D' && 'flex-row',
        size === 'E' && 'justify-center',
        'size-full max-h-[390px] max-w-[390px]',
        'animate-in fade-in-0 zoom-in-0 duration-300' // Always have an enter animation. We hide the first one with a full grid fade anyway.
      )}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      draggable={false} // disable HTML5 dnd
      // TODO: Consider allowing dragging links to other programs with ondragstart="event.dataTransfer.setData('text/plain', href)">
    >
      <CardHeader
        className={cn(
          'space-y-1',
          size === 'D' && 'w-[60%]',
          size === 'E' && 'flex-row items-center gap-1 space-y-0 py-4'
        )}
      >
        {urlType ? (
          <SocialIcon type={urlType} className={cn(size === 'E' && 'size-6')} />
        ) : loading ? (
          <Skeleton
            className={cn(
              'size-10 shrink-0 rounded-lg',
              size === 'E' && 'size-6'
            )}
          />
        ) : (
          <Icon src={iconUrl} mini={size === 'E'} />
        )}
        <CardTitle
          className={cn('text-sm font-normal', size === 'E' && 'flex-1')}
        >
          <InlineEdit
            value={userTitle || fallbackTitle}
            editable={editable}
            onChange={(value) => {
              // If the user clears the title, set it to null to explicitly clear it
              onUpdate?.({ userTitle: value === '' ? null : value });
            }}
            placeholder={fallbackTitle}
            className={cn(
              '-ml-2 line-clamp-3 break-words px-2 py-1',
              editable &&
                'hover:bg-muted rounded-sm transition-colors duration-200',
              size === 'E' && 'm-0 line-clamp-1'
            )}
          />
        </CardTitle>
      </CardHeader>
      {size !== 'E' && size !== 'B' && (
        <CardContent
          className={cn(
            'flex flex-1 items-end justify-end',
            size === 'D' && 'pl-0 pt-6'
          )}
        >
          <div
            className={cn(
              'group/preview relative',
              size === 'A' && 'aspect-[1200/630] w-full',
              size === 'C' && 'aspect-square w-full',
              size === 'D' && 'aspect-square h-full'
            )}
          >
            {loading ? (
              <Skeleton className='size-full' />
            ) : _contentUrl ? (
              isImageError ? (
                editable ? (
                  <ImageErrorFallback className='size-full rounded-md' />
                ) : null
              ) : (
                <img
                  src={_contentUrl}
                  alt={title}
                  className='size-full rounded-md object-cover'
                  onError={() => setIsImageError(true)}
                />
              )
            ) : showPlaceholder ? (
              <ContentPlaceholder className='size-full' />
            ) : null}
            {previewLoading && <Spinner className='absolute right-3 top-3' />}
            {showPreviewControls && (
              <div
                className={cn(
                  'absolute left-0 top-0 -translate-x-[0.75rem] -translate-y-1/2', // position
                  'opacity-0 transition-opacity duration-300 ease-out', // opacity
                  !dragging && 'group-hover/preview:opacity-100' // hover (only if not dragged)
                )}
              >
                <ConnectedPreviewControls widget={{ ...props, id }} />
              </div>
            )}
          </div>
        </CardContent>
      )}
    </a>
  );
};

/**
 * Local component to render a favicon.
 * - If `src` is not given, a default link icon will be rendered.
 */
const Icon: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { src?: string; mini?: boolean }
> = ({ src, className, mini = false, ...rest }) => {
  return (
    <div
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg border p-2',
        mini && 'size-6 p-1',
        mini && src && 'rounded-none border-none p-0',
        className
      )}
      {...rest}
    >
      {src ? (
        <img
          className={cn(
            'size-full rounded-sm', // opt all favicons in to a litttle bit of rounding
            mini && 'rounded-lg' // More if mini
          )}
          src={src}
          alt='Icon for widget'
        />
      ) : (
        // In the case of no src url, render a link icon.
        <Link className={cn('size-full', className)} />
      )}
    </div>
  );
};

const ContentPlaceholder = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => {
  return (
    <div
      className={cn(
        'bg-muted text-muted-foreground group/placeholder flex items-center justify-center rounded-md border p-2 text-center text-sm font-normal',
        className
      )}
      ref={ref}
      {...rest}
    >
      <p className='opacity-0 transition-opacity duration-500 group-hover/placeholder:opacity-100'>
        There's no preview for this link
      </p>
    </div>
  );
});
