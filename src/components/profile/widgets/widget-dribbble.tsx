import React from 'react';

import { DribbbleWidgetContentType, WidgetSize } from '@/types';

import { ImageOverlay } from './image-overlay';
import { WidgetDescription } from './widget-description';
import { WidgetIcon } from './widget-icon';

interface DribbbleWidgetType {
  content: DribbbleWidgetContentType;
  size: WidgetSize;
}

export const DribbbleWidget: React.FC<DribbbleWidgetType> = ({
  content,
  size,
}) => {
  let widgetLayout;
  switch (size) {
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-16'>
              <WidgetIcon type={'Dribbble'} />
            </div>
            <div>
              <div className='text-sm font-semibold'>{content.title}</div>
              <div className='text-xs text-gray-500'>
                <WidgetDescription description={content.description} />
              </div>
            </div>
          </div>
          <div className='relative flex-grow overflow-hidden rounded-xl'>
            <img
              src={content.image}
              alt='Dribbble content'
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
            <WidgetIcon type={'Dribbble'} className='m-0' />
          </div>
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.description}</div>
          </div>
          <div className='relative h-full w-full overflow-hidden rounded-xl'>
            <img
              src={content.image}
              alt='Dribbble content'
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
            <WidgetIcon type={'Dribbble'} />
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.description}</div>
          </div>
          <div className={`relative w-3/5 overflow-hidden rounded-xl`}>
            <img
              src={content.image}
              alt='Dribbble content'
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
          <WidgetIcon type={'Dribbble'} className='m-0' />
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>
              <WidgetDescription description={content.description} />
            </div>
          </div>
          <div className={`relative h-full w-full overflow-hidden rounded-xl`}>
            <img
              src={content.image}
              alt='Dribbble content'
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
