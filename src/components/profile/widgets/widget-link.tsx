import { Link } from 'lucide-react';
import React from 'react';

import { BannerImage } from '@/components/profile/widgets/banner-image';
import { ModifyImageControls } from '@/components/profile/widgets/modify-image-controls';
import { cn } from '@/lib/utils';
import { BaseWidgetProps, LinkWidgetContentType } from '@/types';

import { WidgetHeader } from './widget-header';

interface LinkWidgetProps extends BaseWidgetProps {
  content: LinkWidgetContentType;
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
  redirectUrl,
  handleRestoreImage,
}) => {
  const { title, iconUrl, heroImageUrl } = content;

  const restoreImage = async () => {
    await handleRestoreImage(identifier, 'Link', redirectUrl ?? ''); // Call the mutation with the image URL
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
              <ModifyImageControls
                hasImage={heroImageUrl ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
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
              <ModifyImageControls
                hasImage={heroImageUrl ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
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
                <ModifyImageControls
                  hasImage={!!heroImageUrl}
                  restoreImage={restoreImage}
                  setErrorInvalidImage={setErrorInvalidImage}
                  identifier={identifier}
                  addImage={addImage}
                  removeImage={removeImage}
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
              <ModifyImageControls
                hasImage={heroImageUrl ? true : false}
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
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
