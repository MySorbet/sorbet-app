import React from 'react';

import { SoundcloudTrackContentType, WidgetSize } from '@/types';

import { ImageOverlay } from './image-overlay';
import { PlayButton } from './play-button';
import { WidgetIcon } from './widget-icon';

interface SoundcloudWidgetType {
  content: SoundcloudTrackContentType;
  size: WidgetSize;
}

export const SoundcloudWidget: React.FC<SoundcloudWidgetType> = ({
  content,
  size,
}) => {
  let widgetLayout;

  const localHeader = (
    <>
      <div className='text-sm font-semibold'>{content.title}</div>
      <div className='text-xs text-gray-500'>{content.artist}</div>
    </>
  );

  switch (size) {
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2 '>
          <div className='flex justify-between'>
            <WidgetIcon type='SoundcloudSong' className='m-0' />
            <PlayButton />
          </div>
          <div>{localHeader}</div>
          <div className='relative flex-grow overflow-hidden rounded-xl'>
            <img
              src={content.artwork}
              alt='Soundcloud Content'
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
          <div className='flex justify-between'>
            <WidgetIcon type='SoundcloudSong' className='m-0' />
            <PlayButton />
          </div>
          <div>{localHeader}</div>
          <div className='relative mt-6 h-full w-full overflow-hidden rounded-xl bg-white text-black'>
            <img
              src={content.artwork}
              alt='Soundcloud Content'
              className='absolute inset-0 h-full w-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case 'C':
      widgetLayout = (
        <div className='flex h-full flex-row gap-2'>
          <div className='h-full w-1/5'>
            <div className='flex h-full flex-col gap-1'>
              <WidgetIcon type='SoundcloudSong' />
              <div>{localHeader}</div>
              <div className='mt-auto'>
                <PlayButton />
              </div>
            </div>
          </div>
          <div className='relative h-full w-4/5 overflow-hidden rounded-xl'>
            <img
              src={content.artwork}
              alt='Soundcloud Content'
              className='absolute inset-0 h-full w-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case 'D':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex justify-between'>
            <WidgetIcon type='SoundcloudSong' className='m-0' />
            <PlayButton />
          </div>
          <div>{localHeader}</div>
          <div className='relative mt-6 h-full w-full overflow-hidden rounded-xl'>
            <img
              src={content.artwork}
              alt='Soundcloud Content'
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
