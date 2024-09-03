import { WidgetIcon, ImageOverlay } from '@/components/profile/widgets';
import { SpotifyWidgetContentType, WidgetSize } from '@/types';
import { Play } from 'lucide-react';
import React, { useEffect } from 'react';

interface SpotifyWidgetType {
  content: SpotifyWidgetContentType;
  size: WidgetSize;
}

export const SpotifySongWidget: React.FC<SpotifyWidgetType> = ({
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
            <WidgetIcon type={'SpotifySong'} className='m-0' />
            <button className='flex cursor-pointer items-center gap-1 rounded-lg bg-[#573DF5] px-4 py-1 text-sm text-white'>
              <Play size={16} />
              Play
            </button>
          </div>
          <div>{localHeader}</div>
          <div className='relative flex-grow overflow-hidden rounded-xl'>
            <img
              src={content.cover}
              alt='Spotify content'
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
            <WidgetIcon type={'SpotifySong'} className='m-0' />
            <button className='flex cursor-pointer items-center gap-1 rounded-lg bg-[#573DF5] px-4 py-1 text-sm text-white'>
              <Play size={16} />
              Play
            </button>
          </div>
          <div>{localHeader}</div>
          <div className='relative mt-6 h-full w-full overflow-hidden rounded-xl bg-white text-black'>
            <img
              src={content.cover}
              alt='Spotify content'
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
              <WidgetIcon type={'SpotifySong'} />
              <div>{localHeader}</div>
              <div className='mt-auto'>
                <button className='mt-auto flex cursor-pointer items-center gap-1 rounded-lg bg-[#573DF5] px-4 py-1 text-sm text-white'>
                  <Play size={16} />
                  Play
                </button>
              </div>
            </div>
          </div>
          <div className='relative h-full w-4/5 overflow-hidden rounded-xl'>
            <img
              src={content.cover}
              alt='Spotify content'
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
            <WidgetIcon type={'SpotifySong'} className='m-0' />
            <button className='flex cursor-pointer items-center gap-1 rounded-lg bg-[#573DF5] px-4 py-1 text-sm text-white'>
              <Play size={16} />
              Play
            </button>
          </div>
          <div>{localHeader}</div>
          <div
            className={`relative mt-6 h-full w-full overflow-hidden rounded-xl`}
          >
            <img
              src={content.cover}
              alt='Spotify content'
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
