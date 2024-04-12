import { WidgetHeader } from '@/components/profile';
import { PhotoWidgetContentType, WidgetSize, WidgetType } from '@/types';
import React from 'react';

interface PhotoWidgetType {
  content: PhotoWidgetContentType;
  size: WidgetSize;
}

export const PhotoWidget: React.FC<PhotoWidgetType> = ({ content, size }) => {
  return (
    <div className='relative h-full rounded-xl overflow-hidden'>
      <img
        src={content.image}
        alt='Photo content'
        className={`w-full h-full object-cover ${
          size === WidgetSize.C || size === WidgetSize.D ? '' : 'object-contain'
        }`}
      />
      <div className='absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-50'></div>
    </div>
  );
};
