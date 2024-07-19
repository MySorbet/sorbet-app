import { ImageOverlay } from '@/components/common';
import { WidgetIcon } from '@/components/profile/widgets';
import { WidgetHeader } from '@/components/profile/widgets/';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TwitterWidgetContentType, WidgetSize, WidgetType } from '@/types';
import React from 'react';

interface TwitterWidgetProps {
  /** The content from twitter for the widget to render */
  content: TwitterWidgetContentType;
  /** The size of the widget to render */
  size: WidgetSize;
}

/**
 * Render a Twitter widget with the given content and size
 */
export const TwitterWidget: React.FC<TwitterWidgetProps> = ({
  content,
  size,
}) => {
  let widgetLayout;
  switch (size) {
    case WidgetSize.A:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <WidgetHeader>
            <WidgetIcon type={WidgetType.TwitterProfile} />
            <div className='flex-grow'>
              <div className='text-sm font-semibold'>{content.accountName}</div>
              <div className='text-xs text-gray-500'>
                <TwitterProfileDescription
                  description={content.accountDescription}
                />
              </div>
            </div>
            <FollowButton handle={content.accountHandle} />
          </WidgetHeader>
          <div className='flex-grow relative rounded-xl overflow-hidden'>
            <img
              src={content.bannerImage}
              alt='Twitter content'
              className='absolute inset-0 w-full h-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case WidgetSize.B:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div>
            <WidgetIcon type={WidgetType.TwitterProfile} className='m-0' />
          </div>
          <div>
            <div className='text-sm font-semibold'>{content.accountName}</div>
            <div className='text-xs text-gray-500'>
              <TwitterProfileDescription
                description={content.accountDescription}
              />
            </div>
          </div>
          <div className='h-full w-full relative rounded-xl overflow-hidden'>
            <img
              src={content.bannerImage}
              alt='Twitter content'
              className='w-full h-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case WidgetSize.C:
      widgetLayout = (
        <div className='h-full flex flex-row gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-1/5'>
              <WidgetIcon type={WidgetType.TwitterProfile} />
            </div>
            <div>
              <div className='text-sm font-semibold'>{content.accountName}</div>
              <div className='text-xs text-gray-500'>
                {content.accountDescription}
              </div>
            </div>
          </div>
          <div className={`relative rounded-xl overflow-hidden w-50`}>
            <img
              src={content.bannerImage}
              alt='Twitter content'
              className='w-full h-full object-cover'
              style={{ objectFit: 'cover' }}
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case WidgetSize.D:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <WidgetIcon type={WidgetType.TwitterProfile} className='m-0' />
          <div>
            <div className='text-sm font-semibold'>{content.accountName}</div>
            <div className='text-xs text-gray-500'>
              {content.accountDescription}
            </div>
          </div>
          <div className={`h-full w-full relative rounded-xl overflow-hidden`}>
            <img
              src={content.bannerImage}
              alt='Twitter content'
              className='w-full h-full object-cover'
              style={{ objectFit: 'cover' }}
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};

/**
 * Local component to render a follow button for the twitter profile.
 *
 * Opens the twitter profile in a new tab with the [Follow Web Intent](https://developer.x.com/en/docs/twitter-for-websites/follow-button/guides/web-intent-follow-button).
 *
 * If more complex behavior is needed, consider using [react-twitter-widgets](https://github.com/andrewsuzuki/react-twitter-widgets).
 *
 * TODO: Consider [using `user_id`](https://arc.net/l/quote/omopvnmc) rather than `screen_name`.
 */
const FollowButton: React.FC<{ handle: string }> = ({ handle }) => {
  return (
    <a
      onClick={(e) => e.stopPropagation()} // Prevent the parent widget from handling the click event
      href={`https://x.com/intent/follow?screen_name=${handle}`}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'rounded-full font-semibold text-sm px-3 py-1 h-fit'
      )}
    >
      Follow
    </a>
  );
};

/**
 * Local component to render the twitter profile description, truncating it if it exceeds `DESCRIPTION_CHARS_LIMIT`
 */
const TwitterProfileDescription: React.FC<{ description: string }> = ({
  description,
}) => {
  const DESCRIPTION_CHARS_LIMIT = 80;
  return (
    <span>
      {description.length > DESCRIPTION_CHARS_LIMIT
        ? `${description.substring(0, DESCRIPTION_CHARS_LIMIT)}...`
        : description}
    </span>
  );
};
