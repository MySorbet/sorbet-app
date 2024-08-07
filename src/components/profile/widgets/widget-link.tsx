import { WidgetHeader, ImageOverlay } from '@/components/profile/widgets/';
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
            <Icon src={iconUrl} />
            <Title>{title}</Title>
          </WidgetHeader>
          <BannerImage src={heroImageUrl} />
        </WidgetLayout>
      );
    case WidgetSize.B:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} />
            <Title>{title}</Title>
          </WidgetHeader>
          <BannerImage src={heroImageUrl} />
        </WidgetLayout>
      );
    case WidgetSize.C:
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} />
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
            <Icon src={iconUrl} />
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
 * Local component to render a favicon.
 * - If `src` is not given, a default link icon will be rendered.
 * - You may pass through props to the `<img>` tag if `src` is given.
 * - You may pass through className to the `<Link>` icon if `src` is absent.
 */
const Icon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  className,
  ...rest
}) => {
  return src ? (
    <img
      className={cn('size-[30px]', className)}
      src={src}
      alt={'Icon for widget'}
      width={30}
      height={30}
      {...rest}
    />
  ) : (
    // In the case of no src url, render a link icon.
    // we should have a reset applying border-box. div should be size-8 rounded-xl after the rest if the icons change
    <Link
      className={cn(
        'box-border size-[30px] p-1 bg-gray-300 rounded-md',
        className
      )}
    />
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
