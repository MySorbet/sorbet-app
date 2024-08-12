import { WidgetHeader, ImageOverlay, WidgetIcon } from '@/components';
import { cn } from '@/lib/utils';
import { LinkedInProfileWidgetContentType, WidgetSize } from '@/types';
import React from 'react';

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
    case WidgetSize.A:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={'LinkedInProfile'} className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
          <BannerImage src={bannerImage} />
        </WidgetLayout>
      );
    case WidgetSize.B:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={'LinkedInProfile'} className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
          <BannerImage src={bannerImage} />
        </WidgetLayout>
      );
    case WidgetSize.C:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <WidgetIcon type={'LinkedInProfile'} className='mb-0' />
            <Title>{name}</Title>
          </WidgetHeader>
          <div className='flex flex-row gap-3 justify-end h-full'>
            <BannerImage src={bannerImage} className='w-2/3' />
          </div>
        </WidgetLayout>
      );
    case WidgetSize.D:
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
    <span className='text-secondary-foreground font-semibold text-sm flex-grow self-center'>
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
    className={cn('h-full flex flex-col gap-3', className)}
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
        `h-full w-full relative rounded-2xl overflow-hidden flex items-center justify-center`,
        !src && 'bg-gray-200',
        className
      )}
    >
      {src ? (
        <>
          <img
            src={src}
            alt='Banner image from url'
            className='w-full h-full object-cover'
          />
          <ImageOverlay />
        </>
      ) : (
        <span className='text-muted-foreground font-semibold text-sm'>
          Nothing to see here
        </span>
      )}
    </div>
  );
};
