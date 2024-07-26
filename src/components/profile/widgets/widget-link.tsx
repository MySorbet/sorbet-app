import {
  WidgetHeader,
  WidgetIcon,
  ImageOverlay,
} from '@/components/profile/widgets/';
import { cn } from '@/lib/utils';
import { LinkWidgetContentType, WidgetSize, WidgetType } from '@/types';
import { Link } from 'lucide-react';
import React from 'react';

interface LinkWidgetProps {
  /** The content from link for the widget to render */
  content: LinkWidgetContentType;
  /** The size of the widget to render */
  size: WidgetSize;
}

/**
 * Render a link widget with the given content and size
 */
export const LinkWidget: React.FC<LinkWidgetProps> = ({ content, size }) => {
  const { title, iconUrl, heroImageUrl } = content;

  switch (size) {
    case WidgetSize.A:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} className='m-0' />
            <Title>{title}</Title>
          </WidgetHeader>
          <BannerImage src={heroImageUrl} />
        </WidgetLayout>
      );
    case WidgetSize.B:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} className='m-0' />
            <Title>{title}</Title>
          </WidgetHeader>
          <BannerImage src={heroImageUrl} />
        </WidgetLayout>
      );
    case WidgetSize.C:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} className='m-0' />
            <Title>{title}</Title>
          </WidgetHeader>
          <div className='flex flex-row gap-3 justify-end h-full'>
            <BannerImage src={heroImageUrl} className='w-2/3' />
          </div>
        </WidgetLayout>
      );
    case WidgetSize.D:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} className='m-0' />
            <Title>{title}</Title>
          </WidgetHeader>
          <BannerImage src={heroImageUrl} />
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
 * Local component to render the icon for the link. We need to wrap the shared `<WidgetIcon/>` component to handle the case where the icon is not available.
 */
const Icon: React.FC<{
  src?: string;
  className?: string;
}> = ({ src, className }) => {
  // In the case of no src url, render a link icon
  if (src === undefined) {
    return (
      // we should have a reset applying border-box div should be size-8 rounded-xl after the rest if the icons change
      <Link
        size={22}
        className={cn(
          'box-border size-[30px] p-1 bg-gray-300 rounded-md',
          className
        )}
      />
    );
  } else {
    return <WidgetIcon type={WidgetType.Link} className={className} />;
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
 * Local component to render the banner image for the link.
 *
 * TODO: Use Next.js Image component for better performance.
 */
const BannerImage: React.FC<{ src?: string; className?: string }> = ({
  src,
  className,
}) => {
  if (src === undefined) {
  }
  return (
    <div
      className={cn(
        `h-full w-full relative rounded-2xl overflow-hidden flex items-center justify-center`,
        src === undefined && 'bg-gray-200',
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
