import React from 'react';

import { PhotoWidgetContentType, WidgetSize } from '@/types';

import { ImageOverlay } from './image-overlay';

interface PhotoWidgetType {
  content: PhotoWidgetContentType;
  size: WidgetSize;
}

export const PhotoWidget: React.FC<PhotoWidgetType> = ({ content }) => {
  return (
    <div className='relative h-full overflow-hidden rounded-3xl'>
      <img
        src={content.image}
        alt='Photo content'
        className='relative h-full w-full object-cover'
      />
      <ImageOverlay />
    </div>
  );
};
