import React, { useState } from 'react';

import { PhotoWidgetContentType, WidgetSize } from '@/types';
import Cropper, { Area } from 'react-easy-crop';
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
        style={{
          transform: `translate(-${0}px, -${0}px)`,
        }}
        /** relative h-full w-full object-cover */
      />
      <ImageOverlay />
    </div>
  );
};
