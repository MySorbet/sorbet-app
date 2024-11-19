import React, { Dispatch, SetStateAction } from 'react';

import { BannerImage } from '@/components/profile/widgets/banner-image';
import { ModifyImageWidget } from '@/components/profile/widgets/modify-widget-image';
import { MediumArticleContentType, WidgetSize } from '@/types';

import { ImageOverlay } from './image-overlay';
import { WidgetIcon } from './widget-icon';

interface MediumWidgetType {
  identifier: string;
  showControls?: boolean;
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
  addImage: (key: string, image: File) => Promise<void>;
  removeImage: (key: string) => Promise<void>;
  content: MediumArticleContentType;
  size: WidgetSize;
}

export const MediumWidget: React.FC<MediumWidgetType> = ({
  identifier,
  showControls,
  setErrorInvalidImage,
  addImage,
  removeImage,
  content,
  size,
}) => {
  let widgetLayout;

  const openWidgetLink = () => {
    if (content.image) {
      const newWindow = window.open(content.image, '_blank');
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
              <WidgetIcon type='Medium' />
            </div>
            <div>
              <div className='text-sm font-semibold'>{content.title}</div>
              <div className='text-xs text-gray-500'>{content.host}</div>
            </div>
          </div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.image ? true : false}
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
                src={content.image}
                alt='Medium content'
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
            <WidgetIcon type='Medium' className='m-0' />
          </div>
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.image ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <div className='flex h-full flex-grow overflow-hidden'>
              <BannerImage src={content.image} />
            </div>
          </div>
        </div>
      );
      break;
    case 'C':
      widgetLayout = (
        <div className='flex h-full flex-row gap-2'>
          <div className='w-2/5'>
            <WidgetIcon type='Medium' />
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div className='relative ml-auto w-3/5'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.image ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={content.image} />
          </div>
        </div>
      );
      break;
    case 'D':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <WidgetIcon type='Medium' className='m-0' />
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div className='relative flex-grow'>
            {showControls && (
              <ModifyImageWidget
                hasImage={content.image ? true : false}
                openWidgetLink={openWidgetLink}
                setErrorInvalidImage={setErrorInvalidImage}
                identifier={identifier}
                addImage={addImage}
                removeImage={removeImage}
                className='absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 transform items-center opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
            <BannerImage src={content.image} />
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};
