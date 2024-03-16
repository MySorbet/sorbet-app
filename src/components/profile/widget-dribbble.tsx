import { DribbbleWidgetContentType, WidgetSize } from '@/types';
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
    <div className='relative h-full rounded-xl overflow-hidden'>
      <img
        src={content.image}
        alt='Dribbble content'
        className={`w-full h-full object-cover ${
          size === WidgetSize.C || size === WidgetSize.D ? '' : 'object-contain'
        }`}
      />
    </div>
  );
};
