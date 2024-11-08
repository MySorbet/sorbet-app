import { Area } from 'react-easy-crop';

import { PhotoWidgetContentType, WidgetSize } from '@/types';

import { ImageOverlay } from './image-overlay';

interface PhotoWidgetType {
  content: PhotoWidgetContentType;
  croppedArea?: Area | undefined;
  size: WidgetSize;
}

export const PhotoWidget: React.FC<PhotoWidgetType> = ({
  content,
  croppedArea,
}) => {
  // stylings for cropped images derived from official react-easy-crop examples
  // reference: https://codesandbox.io/p/sandbox/react-easy-crop-with-live-output-kkqj0?file=%2Fsrc%2FApp.jsx%3A49%2C11
  // this is the only approach that seems to handle images of any dimensions.

  /** Calculates how an image should be transformed based on widget's croppedArea property, if it has it */
  const calculateStyles = (croppedArea: Area): React.CSSProperties => {
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

  return (
    <div className='relative h-full overflow-hidden rounded-3xl'>
      <img
        src={content.image}
        alt='Photo content'
        className={
          croppedArea ? 'absolute' : `relative h-full w-full object-cover`
        }
        style={croppedArea ? calculateStyles(croppedArea) : {}}
      />
      <ImageOverlay />
    </div>
  );
};
