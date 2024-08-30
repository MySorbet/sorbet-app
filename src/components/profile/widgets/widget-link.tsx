import { WidgetHeader, ImageOverlay } from '@/components/profile/widgets/';
import { cn } from '@/lib/utils';
import { LinkWidgetContentType, WidgetSize } from '@/types';
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
    case 'A':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} />
            <Title>{title}</Title>
          </WidgetHeader>
          <BannerImage src={heroImageUrl} />
        </WidgetLayout>
      );
    case 'B':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} />
            <Title>{title}</Title>
          </WidgetHeader>
          <BannerImage src={heroImageUrl} />
        </WidgetLayout>
      );
    case 'C':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} />
            <Title>{title}</Title>
          </WidgetHeader>
          <div className='flex max-h-full flex-row justify-end gap-3 overflow-hidden'>
            <BannerImage src={heroImageUrl} className='w-2/3 ' />
          </div>
        </WidgetLayout>
      );
    case 'D':
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
    <span className='text-secondary-foreground flex-grow self-center text-sm font-semibold'>
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
        'box-border size-[30px] rounded-md bg-gray-300 p-1',
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
