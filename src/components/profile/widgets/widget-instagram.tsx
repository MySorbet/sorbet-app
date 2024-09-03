import { ImageOverlay } from '@/components/profile/widgets';
import { WidgetIcon } from '@/components/profile/widgets';
import { InstagramWidgetContentType, WidgetSize } from '@/types';

interface InstagramWidgetType {
  content: InstagramWidgetContentType;
  size: WidgetSize;
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
          <div key={index} className={`col-span-1 ${heightClass}`}>
            <img
              src={`data:image/jpeg;base64,${image}`}
              crossOrigin='anonymous'
              className='h-full w-full rounded-md bg-gray-300 object-cover'
              alt={`Instagram image ${index + 1}`}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
    </>
  );
};

export const InstagramWidget: React.FC<InstagramWidgetType> = ({
  content,
  size,
}) => {
  let widgetLayout;

  const localHeader = (
    <>
      <div className='text-xs text-gray-500'>{content.handle}</div>
    </>
  );

  switch (size) {
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex justify-between'>
            <WidgetIcon type='InstagramProfile' className='m-0' />
          </div>
          <div>{localHeader}</div>
          <div className='relative flex-grow overflow-hidden'>
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
          <div className='relative h-full w-full overflow-hidden rounded-xl bg-white text-black'>
            <InstagramImageContent
              {...content}
              className='grid h-full w-full grid-cols-2 gap-2'
              heightClass='h-44'
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
          <div className='relative h-full w-1/2 overflow-hidden rounded-xl'>
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
}: InstagramImageContentProps) => {
  return (
    <>
      {isPrivate ? (
        <span className='text-muted-foreground flex h-full w-full items-center justify-center rounded-2xl bg-gray-200 text-sm font-semibold'>
          This account is private
        </span>
      ) : images.length > 0 ? (
        <div className={className}>
          <ImageGallery images={images} heightClass={heightClass} />
          <ImageOverlay />
        </div>
      ) : (
        <span className='text-muted-foreground flex h-full w-full items-center justify-center rounded-2xl bg-gray-200 text-sm font-semibold'>
          No pics posted yet!
        </span>
      )}
    </>
  );
};
