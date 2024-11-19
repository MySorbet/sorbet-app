import React from 'react';

import { WidgetSize, YoutubeWidgetContentType } from '@/types';

import { ImageOverlay } from './image-overlay';
import { WidgetIcon } from './widget-icon';
import { ModifyImageWidget } from '@/components/profile/widgets/modify-widget-image';
import { BannerImage } from '@/components/profile/widgets/banner-image';

interface YouTubeWidgetType {
  identifier: string;
  showControls?: boolean;
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
  addImage: (key: string, image: File) => Promise<void>;
  removeImage: (key: string) => Promise<void>;
  content: YoutubeWidgetContentType;
  size: WidgetSize;
}

export const YouTubeWidget: React.FC<YouTubeWidgetType> = ({
  identifier,
  showControls,
  setErrorInvalidImage,
  addImage,
  removeImage,
  content,
  size,
}) => {
  let widgetLayout;

  const localHeader = (
    <>
      <div className='text-sm font-semibold'>{content.title}</div>
      <div className='text-xs text-gray-500'>www.youtube.com</div>
    </>
  );

  const openWidgetLink = () => {
    if (content.thumbnail) {
      const newWindow = window.open(content.thumbnail, '_blank');
      if (newWindow) {
        newWindow.opener = null;
      }
    }
  };

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
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.thumbnail ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <div className='overflow-hidden'>
              <img
                src={content.thumbnail}
                alt='Youtube content'
                className='absolute inset-0 h-full w-full rounded-xl object-cover'
              />
              <ImageOverlay />
            </div>
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
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.thumbnail ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <div className='flex h-full flex-grow overflow-hidden'>
              <BannerImage src={content.thumbnail} />
            </div>
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
          <div className='relative ml-auto w-3/5'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.thumbnail ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={content.thumbnail} />
          </div>
        </div>
      );
      break;
    case 'D':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <WidgetIcon type='Youtube' className='m-0' />
          <div>{localHeader}</div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.thumbnail ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={content.thumbnail} />
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};
