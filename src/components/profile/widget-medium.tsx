import { MediumArticleContentType, WidgetSize } from '@/types';
import React, { useEffect } from 'react';

interface MediumWidgetType {
  content: MediumArticleContentType;
  size: WidgetSize;
}

export const MediumWidget: React.FC<MediumWidgetType> = ({ content, size }) => {
  useEffect(() => {
    console.log(size.toString());
  }, [size]);

  let widgetLayout;
  switch (size) {
    case WidgetSize.A:
      widgetLayout = (
        <div className='h-full flex flex-col gap-1'>
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div className={`relative rounded-xl overflow-hidden`}>
            <img
              src={content.image}
              alt='Medium content'
              className='w-full h-full object-cover'
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      );
      break;
    case WidgetSize.B:
      widgetLayout = (
        <div className='h-full flex flex-col gap-1'>
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div
            className={`relative rounded-xl overflow-hidden absolute bottom-0`}
          >
            <img
              src={content.image}
              alt='Medium content'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      );
      break;
    case WidgetSize.C:
      widgetLayout = (
        <div className='h-full flex flex-row gap-2'>
          <div className='w-2/5'>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div className={`relative rounded-xl overflow-hidden w-3/5`}>
            <img
              src={content.image}
              alt='Medium content'
              className='w-full h-full object-cover'
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      );
      break;
    case WidgetSize.D:
      widgetLayout = (
        <div className='h-full flex flex-col gap-1'>
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.host}</div>
          </div>
          <div className={`relative rounded-xl overflow-hidden`}>
            <img
              src={content.image}
              alt='Medium content'
              className='w-full h-full object-cover'
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      );
      break;
    default:
      widgetLayout = <div>Unsupported widget size</div>;
  }

  return widgetLayout;
};
