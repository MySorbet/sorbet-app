import React from 'react';

import { BannerImage } from '@/components/profile/widgets/banner-image';
import { ModifyImageControls } from '@/components/profile/widgets/modify-widget-image';
import { cn } from '@/lib/utils';
import { BaseWidgetProps, LinkedInProfileWidgetContentType } from '@/types';

import { WidgetHeader } from './widget-header';
import { WidgetIcon } from './widget-icon';

interface LinkedInProfileWidgetProps extends BaseWidgetProps {
  content: LinkedInProfileWidgetContentType;
}

export const LinkedInProfileWidget: React.FC<LinkedInProfileWidgetProps> = ({
  identifier,
  showControls,
  setErrorInvalidImage,
  addImage,
  removeImage,
  content,
  size,
  redirectUrl,
  handleRestoreImage,
}) => {
  const { name, bannerImage } = content;

  const restoreImage = async () => {
    await handleRestoreImage(
      identifier,
      'LinkedInProfile',
      redirectUrl ?? '',
      content
    ); // Call the mutation with the image URL
  };

  switch (size) {
    case 'A':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type='LinkedInProfile' className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
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
            <WidgetIcon type='LinkedInProfile' className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
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
            <WidgetIcon type='LinkedInProfile' className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
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
        </WidgetLayout>
      );
    case 'D':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type='LinkedInProfile' className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageControls
                hasImage={!!bannerImage}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={bannerImage} />
          </div>
        </WidgetLayout>
      );
    default:
      throw new Error('Unsupported widget size');
  }
};

const Title: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <span className='text-secondary-foreground flex-grow self-center text-sm font-semibold'>
      {props.children}
    </span>
  );
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
