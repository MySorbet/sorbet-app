import { ImageOverlay } from '@/components/common';
import { WidgetHeader } from '@/components/profile/widget-header';
import { BehanceWidgetContentType, WidgetSize, WidgetType } from '@/types';
import React from 'react';

interface BehanceWidgetType {
  content: BehanceWidgetContentType;
  size: WidgetSize;
}

export const BehanceWidget: React.FC<BehanceWidgetType> = ({
  content,
  size,
}) => {
  return (
    <>
      <WidgetHeader type={WidgetType.Behance} />
      <div className='relative h-full rounded-xl overflow-hidden'>
        <img
          src={content && content.image ? content.image : '#'}
          alt='Behance content'
          className={`w-full h-full object-cover ${
            size === WidgetSize.C || size === WidgetSize.D
              ? ''
              : 'object-contain'
          }`}
        />

        <ImageOverlay />
      </div>
    </>
  );
};
