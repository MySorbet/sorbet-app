import { ImageOverlay } from '@/components/common';
import { WidgetHeader } from '@/components/profile/widget-header';
import { TwitterWidgetContentType, WidgetSize, WidgetType } from '@/types';
import React, { useEffect } from 'react';

interface TwitterWidgetType {
  content: TwitterWidgetContentType;
  size: WidgetSize;
}

const TwitterProfileDescription: React.FC<{ description: string }> = ({
  description,
}) => {
  const DESCRIPTION_CHARS_LIMIT = 80;
  return (
    <span>
      {description.length > DESCRIPTION_CHARS_LIMIT
        ? `${description.substring(0, DESCRIPTION_CHARS_LIMIT)}...`
        : description}
    </span>
  );
};

export const TwitterWidget: React.FC<TwitterWidgetType> = ({
  content,
  size,
}) => {
  let widgetLayout;
  switch (size) {
    case WidgetSize.A:
      widgetLayout = (
        <div className='h-full flex flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div className='w-20'>
              <WidgetHeader type={WidgetType.Twitter} />
            </div>
            <div>
              <div className='text-sm font-semibold'>{content.accountName}</div>
              <div className='text-xs text-gray-500'>
                <TwitterProfileDescription
                  description={content.accountDescription}
                />
              </div>
            </div>
          </div>
          <div className='flex-grow relative rounded-xl overflow-hidden'>
            <img
              src={content.bannerImage}
              alt='Twitter content'
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
            <WidgetHeader type={WidgetType.Twitter} noMargin />
          </div>
          <div>
            <div className='text-sm font-semibold'>{content.accountName}</div>
            <div className='text-xs text-gray-500'>
              <TwitterProfileDescription
                description={content.accountDescription}
              />
            </div>
          </div>
          <div className='h-full w-full relative rounded-xl overflow-hidden'>
            <img
              src={content.bannerImage}
              alt='Twitter content'
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
          <div className='flex flex-row gap-2'>
            <div className='w-1/5'>
              <WidgetHeader type={WidgetType.Twitter} />
            </div>
            <div>
              <div className='text-sm font-semibold'>{content.accountName}</div>
              <div className='text-xs text-gray-500'>
                {content.accountDescription}
              </div>
            </div>
          </div>
          <div className={`relative rounded-xl overflow-hidden w-50`}>
            <img
              src={content.bannerImage}
              alt='Twitter content'
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
          <WidgetHeader type={WidgetType.Twitter} noMargin />
          <div>
            <div className='text-sm font-semibold'>{content.accountName}</div>
            <div className='text-xs text-gray-500'>
              {content.accountDescription}
            </div>
          </div>
          <div className={`h-full w-full relative rounded-xl overflow-hidden`}>
            <img
              src={content.bannerImage}
              alt='Twitter content'
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
