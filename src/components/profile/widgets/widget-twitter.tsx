import {
  WidgetHeader,
  WidgetIcon,
  ImageOverlay,
} from '@/components/profile/widgets/';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  switch (size) {
    case WidgetSize.A:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={WidgetType.TwitterProfile} className='mb-0' />
            <FollowButton handle={content.accountHandle} />
          </WidgetHeader>
          <Handle handle={content.accountHandle} img={content.profileImage} />
          {/* // TODO: does this need className='flex-grow' on root*/}
          {/* // TODO: does this need className='absolute inset-0' on img*/}
          <BannerImage src={content.bannerImage} />
        </WidgetLayout>
      );
    case WidgetSize.B:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={WidgetType.TwitterProfile} className='m-0' />
            <FollowButton handle={content.accountHandle} />
          </WidgetHeader>
          <Handle handle={content.accountHandle} img={content.profileImage} />
          <Bio bio={content.accountDescription} />
          <BannerImage src={content.bannerImage} />
        </WidgetLayout>
      );
    case WidgetSize.C:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={WidgetType.TwitterProfile} className='m-0' />
            <FollowButton handle={content.accountHandle} />
          </WidgetHeader>
          <Handle handle={content.accountHandle} img={content.profileImage} />
          <div className='flex flex-row gap-3 justify-between h-full'>
            <Bio bio={content.accountDescription} />
            <BannerImage src={content.bannerImage} className='w-2/3' />
          </div>
        </WidgetLayout>
      );
    case WidgetSize.D:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={WidgetType.TwitterProfile} className='m-0' />
            <FollowButton handle={content.accountHandle} />
          </WidgetHeader>
          <Handle handle={content.accountHandle} img={content.profileImage} />
          <Bio bio={content.accountDescription} />
          <BannerImage src={content.bannerImage} />
        </WidgetLayout>
      );
    default:
      return <div>Unsupported widget size</div>;
  }
};

/**
 * Local component to render the layout of the widget as a flex column with a gap between children.
 */
const WidgetLayout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('h-full flex flex-col gap-3', className)}
    {...props}
  />
));

/**
 * Local component to render the avatar image and handle for the twitter profile.
 */
const Handle: React.FC<{ handle: string; img: string }> = ({ handle, img }) => {
  return (
    <div className='flex flex-row gap-1 items-center'>
      <Avatar className='size-5'>
        <AvatarImage src={img} alt={`@${handle}`} />
        <AvatarFallback>{handle.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <span className='text-secondary-foreground text-sm font-medium'>{`@${handle}`}</span>
    </div>
  );
};

/**
 * Local component to render the banner image for the twitter profile.
 *
 * TODO: Use Next.js Image component for better performance.
 */
const BannerImage: React.FC<{ src: string; className?: string }> = ({
  src,
  className,
}) => {
  return (
    <div
      className={cn(
        `h-full w-full relative rounded-2xl overflow-hidden`,
        className
      )}
    >
      <img
        src={src}
        alt='Banner image from twitter profile'
        className='w-full h-full object-cover'
      />
      <ImageOverlay />
    </div>
  );
};

/**
 * Local component to render a follow button for the twitter profile.
 *
 * Opens the twitter profile in a new tab with the [Follow Web Intent](https://developer.x.com/en/docs/twitter-for-websites/follow-button/guides/web-intent-follow-button).
 *
 * If more complex behavior is needed, consider using [react-twitter-widgets](https://github.com/andrewsuzuki/react-twitter-widgets).
 *
 * TODO: Consider [using `user_id`](https://arc.net/l/quote/omopvnmc) rather than `screen_name`.
 * TODO: Should this be disabled in edit mode?
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
const Bio: React.FC<{ bio: string; className?: string }> = ({
  bio,
  className,
}) => {
  const DESCRIPTION_CHARS_LIMIT = 80;
  return (
    <span className={cn('text-xs text-gray-500', className)}>
      {bio.length > DESCRIPTION_CHARS_LIMIT
        ? `${bio.substring(0, DESCRIPTION_CHARS_LIMIT)}...`
        : bio}
    </span>
  );
};
