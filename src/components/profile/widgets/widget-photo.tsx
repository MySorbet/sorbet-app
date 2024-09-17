import React from 'react';

import { ImageOverlay } from '@/components/profile/widgets';
import { cn } from '@/lib/utils';
import { PhotoWidgetContentType, WidgetSize } from '@/types';

interface PhotoWidgetType {
  content: PhotoWidgetContentType;
  size: WidgetSize;
}

export const PhotoWidget: React.FC<PhotoWidgetType> = ({ content, size }) => {
  return (
    <div className='relative h-full overflow-hidden rounded-3xl'>
      <img
        src={content.image}
        alt='Photo content'
        className={cn(
          'relative h-full w-full object-cover',
          size === 'C' || (size === 'D' && 'object-contain')
        )}
      />
      <ImageOverlay />
    </div>
  );
};
