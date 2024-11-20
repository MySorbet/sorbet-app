import { Transition } from '@headlessui/react';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

import { Button } from '@/components/ui/button';
import {
  PhotoWidgetContentType,
  WidgetContentType,
  WidgetLayoutItem,
  WidgetSize,
  WidgetType,
} from '@/types';

import { ResizeWidget } from './resize-widget';

interface CroppingWidgetProps {
  identifier: string;
  type: WidgetType;
  w: number;
  item: WidgetLayoutItem;
  h: number;
  content?: WidgetContentType;
  initialSize?: WidgetSize;
  redirectUrl?: string;
  draggedRef: React.MutableRefObject<boolean>;
  handleImageCropping: (key: string, croppedArea: Area) => Promise<void>;
  handleEditLink: (key: string, url: string) => void;
  setActiveWidget: (widgetId: string | null) => void;
  activeWidget: string | null;
  widgetDimensions: {
    width: number;
    height: number;
  };
  rowHeight: number;
  margins: [number, number];
  cols: number;
}

export const CroppingWidget: React.FC<CroppingWidgetProps> = ({
  identifier,
  type,
  content,
  redirectUrl,
  initialSize = 'A',
  handleImageCropping,
  setActiveWidget,
  activeWidget,
  widgetDimensions,
  rowHeight,
  margins,
  item,
  cols,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1); // used to match the initial zoom caused for all photos from `object-cover` in widget-photo.tsx

  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState(1);

  /** Update cropped image dimensions */
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedArea);
  };

  /** Cancels the cropping session if the user clicks the escape button */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeWidget === identifier) {
        setActiveWidget(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeWidget, identifier, setActiveWidget]);

  // Disable the functionality of the following functions (editing links, resizing)
  // if users are actively cropping

  const onWidgetResize = () => {};

  const onWidgetLinkEdit = () => {};

  /** Calculates dimensions of image */
  const calculateDimensions = (content: PhotoWidgetContentType) => {
    const img = new Image();
    img.src = (content as PhotoWidgetContentType).image;

    if (
      img.width < widgetDimensions.width &&
      img.height >= widgetDimensions.height
    ) {
      setZoom(widgetDimensions.width / img.width);
    }

    setHeight(img.height);
    setWidth(img.width);
  };

  /** Calculates height ratio of image relative to widget dimensions */
  const calculateHeightRatio = () => {
    if (height > widgetDimensions.height) {
      return widgetDimensions.height / height;
    }
    return height / widgetDimensions.height;
  };

  /** In the event the image needs to be scaled up */
  const calculateScaleFactor = (height: number) => {
    let scaleFactor = 1;
    if (height <= widgetDimensions.height) {
      scaleFactor *= widgetDimensions.height / height;
    }
    return scaleFactor;
  };

  useEffect(() => {
    calculateDimensions(content as PhotoWidgetContentType);
  }, [content, calculateDimensions]);

  return (
    <Transition appear={true} show={true}>
      <div
        className='rounded-3xl transition duration-300 ease-in data-[closed]:opacity-0'
        key={identifier}
        style={{
          // Styling must be absolute in order to get widget in the same position it was before cropping was active
          position: 'absolute',
          left: `${
            Math.max(item.x, 0) * (widgetDimensions.width / item.w) -
            width * calculateScaleFactor(height) +
            widgetDimensions.width / 2 +
            margins[0]
          }px`,
          top: `${
            Math.max(item.y, 0) * (widgetDimensions.height / item.h) -
            height * calculateScaleFactor(height) * zoom +
            widgetDimensions.height / 2 +
            margins[0]
          }px`,
        }}
      >
        <Cropper
          style={{
            // we increase the container size by 2x so upscaled image isn't cropped at any point
            containerStyle: {
              position: 'relative',
              height: `${Math.max(
                widgetDimensions.height,
                height * calculateScaleFactor(height) * zoom * 2
              )}px`,
              width: `${Math.max(
                widgetDimensions.width,
                width * calculateScaleFactor(height) * 2
              )}px`,
              background: 'transparent',
            },
            cropAreaStyle: {
              border: '3px solid black',
              borderRadius: '1.5rem',
              color: 'transparent',
            },
            // we need to resize the image manually with mediaStyle to have the overflow appear similar to Bento
            mediaStyle: {
              height: `${height * calculateScaleFactor(height) * zoom}px`,
              width: `${width * calculateScaleFactor(height) * zoom}px`,
              borderRadius: '1.5rem',
            },
          }}
          image={(content as PhotoWidgetContentType)?.image}
          crop={crop}
          // zooming is disabled
          zoom={1}
          aspect={3 / 3}
          // cropSize (the dimensions of the eventual cropped image) must always be the widget dimensions
          cropSize={{
            width: widgetDimensions.width,
            height: widgetDimensions.height,
          }}
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          initialCroppedAreaPercentages={
            (content as PhotoWidgetContentType).croppedArea
              ? (content as PhotoWidgetContentType).croppedArea
              : undefined
          }
        />
        <div
          className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transform ${
            isPopoverOpen
              ? ''
              : 'opacity-0 transition-opacity duration-300 hover:opacity-100'
          }`}
          style={{
            top: `calc(50% + ${widgetDimensions.height / 2}px)`, // Adjusting the top position
          }}
        >
          <div className='flex flex-row gap-1'>
            <ResizeWidget
              redirectUrl={redirectUrl}
              onResize={onWidgetResize}
              onEditLink={onWidgetLinkEdit}
              setPopoverOpen={setIsPopoverOpen}
              popoverOpen={isPopoverOpen}
              initialSize={initialSize}
              identifier={identifier}
              activeWidget={activeWidget}
              croppedArea={croppedArea}
              handleImageCropping={handleImageCropping}
              setActiveWidget={setActiveWidget}
              type={type}
            />
            <Button
              variant='outline'
              size='icon'
              className='rounded-full border-gray-800 bg-gray-800 text-white hover:bg-gray-800 hover:text-white'
              disabled={!!activeWidget}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  );
};