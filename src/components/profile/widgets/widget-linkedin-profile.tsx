import React from 'react';

import { cn } from '@/lib/utils';
import { LinkedInProfileWidgetContentType, WidgetSize } from '@/types';

import { ImageOverlay } from './image-overlay';
import { WidgetHeader } from './widget-header';
import { WidgetIcon } from './widget-icon';

// TODO: This could be shared type WidgetProps<LinkedInProfileWidgetContentType>
interface LinkedInProfileWidgetProps {
  /** The content from link for the widget to render */
  content: LinkedInProfileWidgetContentType;
  /** The size of the widget to render */
  size: WidgetSize;
}

export const LinkedInProfileWidget: React.FC<LinkedInProfileWidgetProps> = ({
  content,
  size,
}) => {
  const { name, bio, profileImage, bannerImage } = content;

  switch (size) {
    case 'A':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={'LinkedInProfile'} className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
          <BannerImage src={bannerImage} />
        </WidgetLayout>
      );
    case 'B':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={'LinkedInProfile'} className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
          <BannerImage src={bannerImage} />
        </WidgetLayout>
      );
    case 'C':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={'LinkedInProfile'} className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
          <div className='flex h-full flex-row justify-end gap-3'>
            <BannerImage src={bannerImage} className='w-2/3' />
          </div>
        </WidgetLayout>
      );
    case 'D':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={'LinkedInProfile'} className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
          <BannerImage src={bannerImage} />
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

/**
 * Local component to render the banner image for the link.
 */
const BannerImage: React.FC<{ src?: string; className?: string }> = ({
  src,
  className,
}) => {
  return (
    <div
      className={cn(
        `relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl`,
        !src && 'bg-gray-200',
        className
      )}
    >
      {src ? (
        <>
          <img
            src={src}
            alt='Banner image from url'
            className='h-full w-full object-cover'
          />
          <ImageOverlay />
        </>
      ) : (
        <span className='text-muted-foreground text-sm font-semibold'>
          Nothing to see here
        </span>
      )}
    </div>
  );
};
