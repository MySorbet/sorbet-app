import { toast } from 'sonner';

import { ModifyImageControls } from '@/components/profile/widgets/modify-image-controls';
import { cn } from '@/lib/utils';
import { BaseWidgetProps, InstagramWidgetContentType } from '@/types';

import { ImageOverlay } from './image-overlay';
import { WidgetIcon } from './widget-icon';

interface InstagramWidgetProps extends BaseWidgetProps {
  content: InstagramWidgetContentType;
}

interface ImageGalleryProps {
  images: string[];
  heightClass: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, heightClass }) => {
  return (
    <>
      {images &&
        images.length > 0 &&
        images.map((image, index) => (
          <div key={index} className={cn(`relative col-span-1`, heightClass)}>
            <img
              src={`data:image/jpeg;base64,${image}`}
              crossOrigin='anonymous'
              className='h-full w-full rounded-md object-cover '
              alt={`Instagram image ${index + 1}`}
              style={{ objectFit: 'cover' }}
            />
            <ImageOverlay />
          </div>
        ))}
    </>
  );
};

export const InstagramWidget: React.FC<InstagramWidgetProps> = ({
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
  let widgetLayout;

  const localHeader = (
    <>
      <div className='text-xs text-gray-500'>{content.handle}</div>
    </>
  );

  const restoreImage = async () => {
    try {
      await handleRestoreImage(
        identifier,
        'InstagramProfile',
        redirectUrl ?? ''
      ); // Call the mutation with the image URL
    } catch (error) {
      toast('Failed to update widget', {
        description: 'If the issue persists, contact support',
      });
    }
  };

  switch (size) {
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex justify-between'>
            <WidgetIcon type='InstagramProfile' className='m-0' />
          </div>
          <div>{localHeader}</div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageControls
                hasImage={
                  content.replacementPicture || content.images ? true : false
                }
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
              />
            )}
            <InstagramImageContent
              {...content}
              className='grid grid-cols-3 gap-1'
              heightClass='h-20'
            />
          </div>
        </div>
      );
      break;
    case 'B':
      widgetLayout = (
        <div className='flex h-full flex-row gap-2'>
          <div className='flex w-2/6 flex-col gap-2'>
            <WidgetIcon type='InstagramProfile' className='m-0' />
            <div>{localHeader}</div>
          </div>
          <div className='relative h-full w-full rounded-xl bg-white text-black'>
            {showControls && (
              <ModifyImageControls
                hasImage={
                  content.replacementPicture || content.images ? true : false
                }
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
              />
            )}
            <InstagramImageContent
              {...content}
              className='grid h-full w-full grid-cols-2 gap-2'
              heightClass='h-[10.5rem]' // arbitrary value used to ensure height matches the container
            />
          </div>
        </div>
      );
      break;
    case 'C':
      widgetLayout = (
        <div className='flex h-full flex-row gap-2'>
          <div className='h-full w-1/2'>
            <div className='flex h-full flex-col gap-1'>
              <WidgetIcon type='InstagramProfile' className='m-0' />
              <div>{localHeader}</div>
            </div>
          </div>
          <div className='relative h-full w-1/2 rounded-xl'>
            {showControls && (
              <ModifyImageControls
                hasImage={
                  content.replacementPicture || content.images ? true : false
                }
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
              />
            )}
            <InstagramImageContent
              {...content}
              className='grid h-full w-full grid-cols-2 gap-2'
              heightClass='h-20'
            />
          </div>
        </div>
      );
      break;
    case 'D':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex justify-between'>
            <WidgetIcon type='InstagramProfile' className='m-0' />
          </div>
          <div>{localHeader}</div>
          <div className='relative mt-24 h-full w-full overflow-hidden rounded-xl'>
            {showControls && (
              <ModifyImageControls
                hasImage={
                  content.replacementPicture || content.images ? true : false
                }
                restoreImage={restoreImage}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
              />
            )}
            <InstagramImageContent
              {...content}
              className='grid h-full w-full grid-cols-2 gap-2'
              heightClass='h-28'
            />
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};

interface InstagramImageContentProps extends InstagramWidgetContentType {
  className: string;
  heightClass: string;
}

const InstagramImageContent = ({
  isPrivate,
  images,
  className,
  heightClass,
  replacementPicture,
}: InstagramImageContentProps) => {
  // priority to display: images from the actual profile -> pictures the sorbet user uploaded -> placeholders
  return (
    <>
      {images.length > 0 ? (
        <div className={className}>
          <ImageGallery images={images} heightClass={heightClass} />
        </div>
      ) : replacementPicture ? (
        <>
          <img
            src={replacementPicture}
            alt='Banner image from url'
            className='absolute inset-0 h-full w-full rounded-xl object-cover'
          />
          <ImageOverlay />
        </>
      ) : isPrivate ? (
        <span className='text-muted-foreground flex h-full w-full items-center justify-center rounded-2xl bg-gray-100 text-sm font-semibold'>
          This account is private
        </span>
      ) : (
        <span className='text-muted-foreground flex h-full w-full items-center justify-center rounded-2xl bg-gray-100 text-sm font-semibold'>
          Nothing to see here
        </span>
      )}
    </>
  );
};
