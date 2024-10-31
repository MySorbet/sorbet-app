import React, { useState } from 'react';

import { PhotoWidgetContentType, WidgetSize } from '@/types';
import Cropper, { Area } from 'react-easy-crop';
import { ImageOverlay } from './image-overlay';

interface PhotoWidgetType {
  content: PhotoWidgetContentType;
  // offsets: { x: number; y: number } | undefined;
  // zoom: number | undefined;
  croppedArea?:
    | { x: number; y: number; width: number; height: number }
    | undefined;
  size: WidgetSize;
}

export const PhotoWidget: React.FC<PhotoWidgetType> = ({
  content,
  //offsets,
  // zoom,
  croppedArea,
}) => {
  const calculateStyles = (croppedArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): React.CSSProperties => {
    const scale = 100 / croppedArea?.width;
    const transform = {
      x: `${-croppedArea.x * scale}%`,
      y: `${-croppedArea.y * scale}%`,
      scale,
      width: 'calc(100% + 0.5px)',
      height: 'auto',
    };

    return {
      transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
      width: transform.width,
      height: transform.height,
      top: 0,
      left: 0,
      transformOrigin: 'top left',
    };
  };

  console.log(croppedArea);
  return (
    <div className='relative h-full overflow-hidden rounded-3xl'>
      <img
        src={content.image}
        alt='Photo content'
        className={
          croppedArea ? 'absolute' : 'relative h-full w-full object-cover'
        }
        style={croppedArea ? calculateStyles(croppedArea) : {}}
      />
      <ImageOverlay />
    </div>
  );
};

// reference from react-easy-crop
/** 
.output {
  position: relative;
  width: 300px;
  overflow: hidden;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.3);
}

.output img {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
}
  */
