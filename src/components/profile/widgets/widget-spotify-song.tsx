import { ImageOverlay } from '@/components/common';
import { WidgetHeader } from '@/components/profile/widgets';
import { SpotifyWidgetContentType, WidgetSize, WidgetType } from '@/types';
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
  useEffect(() => {
    console.log(size.toString());
  }, [size]);

  let widgetLayout;
  const currentType = WidgetType.SpotifySong;

  const localHeader = (
    <>
      <div className='text-sm font-semibold'>{content.title}</div>
      <div className='text-xs text-gray-500'>{content.artist}</div>
    </>
  );

  switch (size) {
    case WidgetSize.A:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2 '>
          <div className='flex justify-between'>
            <WidgetHeader type={currentType} noMargin />
            <button className='cursor-pointer flex gap-1 items-center bg-[#573DF5] text-white px-4 text-sm py-1 rounded-lg'>
              <Play size={16} />
              Play
            </button>
          </div>
          <div>{localHeader}</div>
          <div className='flex-grow relative rounded-xl overflow-hidden'>
            <img
              src={content.cover}
              alt='Spotify content'
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
          <div className='flex justify-between'>
            <WidgetHeader type={currentType} noMargin />
            <button className='cursor-pointer flex gap-1 items-center bg-[#573DF5] text-white px-4 text-sm py-1 rounded-lg'>
              <Play size={16} />
              Play
            </button>
          </div>
          <div>{localHeader}</div>
          <div className='h-full w-full relative rounded-xl overflow-hidden mt-6 bg-white text-black'>
            <img
              src={content.cover}
              alt='Spotify content'
              className='absolute inset-0 w-full h-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case WidgetSize.C:
      widgetLayout = (
        <div className='h-full flex flex-row gap-2'>
          <div className='w-1/5 h-full'>
            <div className='flex flex-col gap-1 h-full'>
              <WidgetHeader type={currentType} />
              <div>{localHeader}</div>
              <div className='mt-auto'>
                <button className='cursor-pointer flex gap-1 items-center bg-[#573DF5] text-white px-4 text-sm py-1 rounded-lg mt-auto'>
                  <Play size={16} />
                  Play
                </button>
              </div>
            </div>
          </div>
          <div className='relative rounded-xl overflow-hidden w-4/5 h-full'>
            <img
              src={content.cover}
              alt='Spotify content'
              className='absolute inset-0 w-full h-full object-cover'
            />
            <ImageOverlay />
          </div>
        </div>
      );
      break;
    case WidgetSize.D:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div className='flex justify-between'>
            <WidgetHeader type={currentType} noMargin />
            <button className='cursor-pointer flex gap-1 items-center bg-[#573DF5] text-white px-4 text-sm py-1 rounded-lg'>
              <Play size={16} />
              Play
            </button>
          </div>
          <div>{localHeader}</div>
          <div
            className={`h-full w-full relative rounded-xl overflow-hidden mt-6`}
          >
            <img
              src={content.cover}
              alt='Spotify content'
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
