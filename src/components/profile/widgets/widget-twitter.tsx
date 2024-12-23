import React from 'react';

import { BannerImage } from '@/components/profile/widgets/banner-image';
import { ModifyImageControls } from '@/components/profile/widgets/modify-image-controls';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BaseWidgetProps, TwitterWidgetContentType } from '@/types';

import { WidgetHeader } from './widget-header';
import { WidgetIcon } from './widget-icon';

interface TwitterWidgetProps extends BaseWidgetProps {
  content: TwitterWidgetContentType;
}

/**
 * Render a Twitter widget with the given content and size
 */
export const TwitterWidget: React.FC<TwitterWidgetProps> = ({
  identifier,
  showControls,
  setErrorInvalidImage,
  content,
  addImage,
  removeImage,
  size,
  redirectUrl,
  handleRestoreImage,
}) => {
  const { handle, bio, bannerImage, profileImage } = content;

  const restoreImage = async () => {
    await handleRestoreImage(identifier, 'TwitterProfile', redirectUrl ?? ''); // Call the mutation with the image URL
  };

  switch (size) {
    case 'A':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type='TwitterProfile' className='mb-0' />
            <FollowButton handle={handle} />
          </WidgetHeader>
          <Handle handle={handle} img={profileImage} />
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageControls
                hasImage={!!bannerImage}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
              />
            )}
            <div className='flex h-full flex-grow overflow-hidden'>
              <BannerImage src={bannerImage} />
            </div>
          </div>
        </WidgetLayout>
      );
    case 'B':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type='TwitterProfile' className='m-0' />
            <FollowButton handle={handle} />
          </WidgetHeader>
          <Handle handle={handle} img={profileImage} />
          <Bio bio={bio} />
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageControls
                hasImage={!!bannerImage}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
              />
            )}
            <div className='flex h-full flex-grow overflow-hidden'>
              <BannerImage src={bannerImage} />
            </div>
          </div>
        </WidgetLayout>
      );
    case 'C':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type='TwitterProfile' className='m-0' />
            <FollowButton handle={handle} />
          </WidgetHeader>
          <Handle handle={handle} img={profileImage} />
          <div className='flex h-full flex-row justify-between gap-3'>
            <Bio bio={bio} />
            <div className='relative ml-auto w-3/5'>
              {showControls && (
                <ModifyImageControls
                  hasImage={!!bannerImage}
                  restoreImage={restoreImage}
                  setErrorInvalidImage={setErrorInvalidImage}
                  identifier={identifier}
                  addImage={addImage}
                  removeImage={removeImage}
                />
              )}
              <BannerImage src={bannerImage} />
            </div>
          </div>
        </WidgetLayout>
      );
    case 'D':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type='TwitterProfile' className='m-0' />
            <FollowButton handle={handle} />
          </WidgetHeader>
          <Handle handle={handle} img={profileImage} />
          <Bio bio={bio} />
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageControls
                hasImage={!!bannerImage}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
              />
            )}
            <BannerImage src={bannerImage} />
          </div>
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
    className={cn('flex h-full flex-col gap-3', className)}
    {...props}
  />
));

/**
 * Local component to render the avatar image and handle for the twitter profile.
 */
const Handle: React.FC<{ handle: string; img: string }> = ({ handle, img }) => {
  return (
    <div className='flex flex-row items-center gap-1'>
      <Avatar className='size-5'>
        <AvatarImage src={img} alt={`@${handle}`} />
        <AvatarFallback>{handle.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <span className='text-secondary-foreground text-sm font-medium'>{`@${handle}`}</span>
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
        'h-fit rounded-full px-3 py-1 text-sm font-semibold'
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
