import { Link } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

import { ModifyImageWidget } from '@/components/profile/widgets/modify-widget-image';
import { cn } from '@/lib/utils';
import { LinkWidgetContentType, WidgetSize } from '@/types';

import { ImageOverlay } from './image-overlay';
import { WidgetHeader } from './widget-header';

interface LinkWidgetProps {
  /** The content from link for the widget to render */
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
  content: LinkWidgetContentType;
  addImage: (key: string, image: File) => Promise<void>;
  removeImage: (key: string) => Promise<void>;
  identifier: string;
  showControls?: boolean;
  /** The size of the widget to render */
  size: WidgetSize;
}

/**
 * Render a link widget with the given content and size
 */
export const LinkWidget: React.FC<LinkWidgetProps> = ({
  setErrorInvalidImage,
  content,
  identifier,
  addImage,
  removeImage,
  showControls,
  size,
}) => {
  const { title, iconUrl, heroImageUrl } = content;

  const openWidgetLink = (event: React.MouseEvent<HTMLDivElement>) => {
    if (heroImageUrl) {
      const newWindow = window.open(heroImageUrl, '_blank');
      if (newWindow) {
        newWindow.opener = null;
      }
    }
  };

  switch (size) {
    case 'A':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} />
            <Title>{title}</Title>
          </WidgetHeader>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={heroImageUrl ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <div className='flex h-full flex-grow overflow-hidden'>
              <BannerImage src={heroImageUrl} />
            </div>
          </div>
        </WidgetLayout>
      );
    case 'B':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} />
            <Title>{title}</Title>
          </WidgetHeader>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={heroImageUrl ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <div className='flex h-full flex-grow overflow-hidden'>
              <BannerImage src={heroImageUrl} />
            </div>
          </div>
        </WidgetLayout>
      );
    case 'C':
      return (
        <WidgetLayout>
          <WidgetHeader>
            <Icon src={iconUrl} />
            <Title>{title}</Title>
          </WidgetHeader>
          <div className='flex h-full flex-row justify-end gap-3'>
            <div className='relative ml-auto w-2/3'>
              {showControls && (
                <ModifyImageWidget
                  hasImage={heroImageUrl ? true : false}
                  openWidgetLink={openWidgetLink}
                  setErrorInvalidImage={setErrorInvalidImage}
                  identifier={identifier}
                  addImage={addImage}
                  removeImage={removeImage}
                  className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
                />
              )}
              <BannerImage src={heroImageUrl} />
            </div>
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
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={heroImageUrl ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={heroImageUrl} />
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
      alt='Icon for widget'
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
        'flex h-full w-full items-center justify-center overflow-hidden rounded-2xl',
        !src && 'bg-gray-200',
        className
      )}
    >
      {src ? (
        <>
          <img
            src={src}
            alt='Banner image from url'
            className='absolute inset-0 h-full w-full rounded-xl object-cover'
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
