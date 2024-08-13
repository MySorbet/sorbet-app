import React, { useEffect } from 'react';

import { ImageOverlay, WidgetIcon } from '@/components/profile/widgets';
import { WidgetSize, YoutubeWidgetContentType } from '@/types';

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
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-1/4'>
              <WidgetIcon type='Youtube' />
            </div>
            <div>{localHeader}</div>
          </div>
          <div className='relative flex-grow overflow-hidden rounded-xl'>
            <img
              src={content.thumbnail}
              alt='Medium content'
              className='absolute inset-0 h-full w-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case 'B':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div>
            <WidgetIcon type='Youtube' className='m-0' />
          </div>
          <div>{localHeader}</div>
          <div className='relative h-full w-full overflow-hidden rounded-xl'>
            <img
              src={content.thumbnail}
              alt='Medium content'
              className='h-full w-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case 'C':
      widgetLayout = (
        <div className='flex h-full flex-row gap-2'>
          <div className='w-2/5'>
            <WidgetIcon type='Youtube' />
            {localHeader}
          </div>
          <div className='relative w-3/5 overflow-hidden rounded-xl'>
            <img
              src={content.thumbnail}
              alt='Medium content'
              className='h-full w-full object-cover'
              style={{ objectFit: 'cover' }}
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case 'D':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <WidgetIcon type='Youtube' className='m-0' />
          <div>{localHeader}</div>
          <div className='relative h-full w-full overflow-hidden rounded-xl'>
            <img
              src={content.thumbnail}
              alt='Medium content'
              className='h-full w-full object-cover'
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
