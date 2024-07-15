import { ImageOverlay } from '@/components/common';
import { WidgetHeader } from '@/components/profile/widgets/widget-header';
import { InstagramWidgetContentType, WidgetSize, WidgetType } from '@/types';
import React from 'react';

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
      {images && images.length > 0 ? (
        images.map((image, index) => (
          <div key={index} className={`col-span-1 ${heightClass}`}>
            <img
              src={`data:image/jpeg;base64,${image}`}
              crossOrigin='anonymous'
              className='bg-gray-300 object-cover w-full h-full rounded-md'
              alt={`Instagram image ${index + 1}`}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))
      ) : (
        <div className='w-full h-full bg-gray-300'></div>
      )}
    </>
  );
};

export const InstagramWidget: React.FC<InstagramWidgetType> = ({
  content,
  size,
}) => {
  let widgetLayout;
  const currentType = WidgetType.InstagramProfile;

  const localHeader = (
    <>
      <div className='text-xs text-gray-500'>{content.handle}</div>
    </>
  );

  switch (size) {
    case WidgetSize.A:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div className='flex justify-between'>
            <WidgetHeader type={currentType} noMargin />
          </div>
          <div>{localHeader}</div>
          <div className='flex-grow relative overflow-hidden'>
            <div className='grid grid-cols-3 gap-1'>
              <ImageGallery images={content.images} heightClass='h-20' />
              <ImageOverlay />
            </div>
          </div>
        </div>
      );
      break;
    case WidgetSize.B:
      widgetLayout = (
        <div className='h-full flex flex-row gap-2'>
          <div className='w-2/6 flex flex-col gap-2'>
            <WidgetHeader type={currentType} noMargin />
            <div>{localHeader}</div>
          </div>
          <div className='w-4/6 h-full w-full relative rounded-xl overflow-hidden bg-white text-black'>
            <div className='grid grid-cols-2 gap-2 w-full h-full'>
              <ImageGallery images={content.images} heightClass='h-44' />
              <ImageOverlay />
            </div>
          </div>
        </div>
      );
      break;
    case WidgetSize.C:
      widgetLayout = (
        <div className='h-full flex flex-row gap-2'>
          <div className='w-1/2 h-full'>
            <div className='flex flex-col gap-1 h-full'>
              <WidgetHeader type={currentType} noMargin />
              <div>{localHeader}</div>
            </div>
          </div>
          <div className='w-1/2 relative rounded-xl overflow-hidden h-full'>
            <div className='grid grid-cols-2 gap-2 w-full h-full'>
              <ImageGallery images={content.images} heightClass='h-20' />
              <ImageOverlay />
            </div>
          </div>
        </div>
      );
      break;
    case WidgetSize.D:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div className='flex justify-between'>
            <WidgetHeader type={currentType} noMargin />
          </div>
          <div>{localHeader}</div>
          <div
            className={`h-full w-full relative rounded-xl overflow-hidden mt-24`}
          >
            <div className='grid grid-cols-2 gap-2 w-full h-full'>
              <ImageGallery images={content.images} heightClass='h-28' />
              <ImageOverlay />
            </div>
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};
