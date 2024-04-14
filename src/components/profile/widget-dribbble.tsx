import { ImageOverlay, WidgetDescription } from '@/components/common';
import { WidgetHeader } from '@/components/profile';
import { DribbbleWidgetContentType, WidgetSize, WidgetType } from '@/types';
import React from 'react';

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
    case WidgetSize.A:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-16'>
              <WidgetHeader type={WidgetType.Dribbble} />
            </div>
            <div>
              <div className='text-sm font-semibold'>{content.title}</div>
              <div className='text-xs text-gray-500'>
                <WidgetDescription description={content.description} />
              </div>
            </div>
          </div>
          <div className='flex-grow relative rounded-xl overflow-hidden'>
            <img
              src={content.image}
              alt='Dribbble content'
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
            <WidgetHeader type={WidgetType.Dribbble} noMargin />
          </div>
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.description}</div>
          </div>
          <div className='h-full w-full relative rounded-xl overflow-hidden'>
            <img
              src={content.image}
              alt='Dribbble content'
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
            <WidgetHeader type={WidgetType.Dribbble} />
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>{content.description}</div>
          </div>
          <div className={`relative rounded-xl overflow-hidden w-3/5`}>
            <img
              src={content.image}
              alt='Dribbble content'
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
          <WidgetHeader type={WidgetType.Dribbble} noMargin />
          <div>
            <div className='text-sm font-semibold'>{content.title}</div>
            <div className='text-xs text-gray-500'>
              <WidgetDescription description={content.description} />
            </div>
          </div>
          <div className={`h-full w-full relative rounded-xl overflow-hidden`}>
            <img
              src={content.image}
              alt='Dribbble content'
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
