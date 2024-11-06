import React from 'react';

import { SubstackWidgetContentType, WidgetSize } from '@/types';

import { ImageOverlay } from './image-overlay';
import { WidgetIcon } from './widget-icon';

interface SubstackWidgetType {
  content: SubstackWidgetContentType;
  size: WidgetSize;
}

export const SubstackWidget: React.FC<SubstackWidgetType> = ({
  content,
  size,
}) => {
  let widgetLayout;

  const localHeader = (
    <>
      <div className='text-sm font-semibold'>{content.title}</div>
      <div className='text-xs text-gray-500'>{content.host}</div>
    </>
  );

  switch (size) {
    case 'A':
      widgetLayout = (
        <div className='flex h-full flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-8'>
              <WidgetIcon type="Substack" />
            </div>
            <div className='w-90'>{localHeader}</div>
          </div>
          <div className='relative flex-grow overflow-hidden rounded-xl'>
            <img
              src={content.image}
              alt='Substack content'
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
            <WidgetIcon type="Substack" className='m-0' />
          </div>
          <div>{localHeader}</div>
          <div className='relative h-full w-full overflow-hidden rounded-xl'>
            <img
              src={content.image}
              alt='Substack content'
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
            <WidgetIcon type="Substack" />
            {localHeader}
          </div>
          <div className="relative w-3/5 overflow-hidden rounded-xl">
            <img
              src={content.image}
              alt='Substack content'
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
          <WidgetIcon type="Substack" className='m-0' />
          <div>{localHeader}</div>
          <div className="relative h-full w-full overflow-hidden rounded-xl">
            <img
              src={content.image}
              alt='Substack content'
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
