import { WidgetHeader } from '@/components/profile/widget-header';
import { SubstackWidgetContentType, WidgetSize, WidgetType } from '@/types';
import React, { useEffect } from 'react';

interface SubstackWidgetType {
  content: SubstackWidgetContentType;
  size: WidgetSize;
}

export const SubstackWidget: React.FC<SubstackWidgetType> = ({
  content,
  size,
}) => {
  let widgetLayout;
  const currentType = WidgetType.Substack;

  const localHeader = (
    <>
      <div className='text-sm font-semibold'>{content.title}</div>
      <div className='text-xs text-gray-500'>{content.host}</div>
    </>
  );

  switch (size) {
    case WidgetSize.A:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-1/4'>
              <WidgetHeader type={currentType} />
            </div>
            <div>{localHeader}</div>
          </div>
          <div className='flex-grow relative rounded-xl overflow-hidden'>
            <img
              src={content.image}
              alt='Substack content'
              className='absolute inset-0 w-full h-full object-cover'
            />
          </div>
        </div>
      );
      break;
    case WidgetSize.B:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div>
            <WidgetHeader type={currentType} noMargin />
          </div>
          <div>{localHeader}</div>
          <div className='h-full w-full relative rounded-xl overflow-hidden'>
            <img
              src={content.image}
              alt='Substack content'
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
            <WidgetHeader type={currentType} />
            {localHeader}
          </div>
          <div className={`relative rounded-xl overflow-hidden w-3/5`}>
            <img
              src={content.image}
              alt='Substack content'
              className='w-full h-full object-cover'
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      );
      break;
    case WidgetSize.D:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <WidgetHeader type={currentType} noMargin />
          <div>{localHeader}</div>
          <div className={`h-full w-full relative rounded-xl overflow-hidden`}>
            <img
              src={content.image}
              alt='Substack content'
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
