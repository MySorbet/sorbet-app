import { WidgetIcon, ImageOverlay } from '@/components/profile/widgets';
import { WidgetSize, YoutubeWidgetContentType } from '@/types';
import React, { useEffect } from 'react';

interface YouTubeWidgetType {
  content: YoutubeWidgetContentType;
  size: WidgetSize;
}

export const YouTubeWidget: React.FC<YouTubeWidgetType> = ({
  content,
  size,
}) => {
  useEffect(() => {
    console.log(size.toString());
  }, [size]);

  let widgetLayout;

  const localHeader = (
    <>
      <div className='text-sm font-semibold'>{content.title}</div>
      <div className='text-xs text-gray-500'>www.youtube.com</div>
    </>
  );

  switch (size) {
    case WidgetSize.A:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-1/4'>
              <WidgetIcon type={'Youtube'} />
            </div>
            <div>{localHeader}</div>
          </div>
          <div className='flex-grow relative rounded-xl overflow-hidden'>
            <img
              src={content.thumbnail}
              alt='Medium content'
              className='absolute inset-0 w-full h-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case WidgetSize.B:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div>
            <WidgetIcon type={'Youtube'} className='m-0' />
          </div>
          <div>{localHeader}</div>
          <div className='h-full w-full relative rounded-xl overflow-hidden'>
            <img
              src={content.thumbnail}
              alt='Medium content'
              className='w-full h-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case WidgetSize.C:
      widgetLayout = (
        <div className='h-full flex flex-row gap-2'>
          <div className='w-2/5'>
            <WidgetIcon type={'Youtube'} />
            {localHeader}
          </div>
          <div className={`relative rounded-xl overflow-hidden w-3/5`}>
            <img
              src={content.thumbnail}
              alt='Medium content'
              className='w-full h-full object-cover'
              style={{ objectFit: 'cover' }}
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case WidgetSize.D:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <WidgetIcon type={'Youtube'} className='m-0' />
          <div>{localHeader}</div>
          <div className={`h-full w-full relative rounded-xl overflow-hidden`}>
            <img
              src={content.thumbnail}
              alt='Medium content'
              className='w-full h-full object-cover'
              style={{ objectFit: 'cover' }}
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};
