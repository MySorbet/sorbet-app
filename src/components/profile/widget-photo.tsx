import { ImageOverlay } from '@/components/common';
import { PhotoWidgetContentType, WidgetSize } from '@/types';
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
      <ImageOverlay />
    </div>
  );
};
