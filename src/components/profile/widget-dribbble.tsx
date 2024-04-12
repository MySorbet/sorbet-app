import { ImageOverlay } from '@/components/common';
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
  return (
    <>
      <WidgetHeader type={WidgetType.Dribbble} />
      <div className='relative h-full rounded-xl overflow-hidden'>
        <img
          src={content.image}
          alt='Dribbble content'
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
