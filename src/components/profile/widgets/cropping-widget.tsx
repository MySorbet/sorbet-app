import { Transition } from '@headlessui/react';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
  margins: [number, number];
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
  margins,
  item,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const cropperRef = useRef<HTMLDivElement | null>(null); // Added reference for Cropper

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1); // used to match the initial zoom caused for all photos from `object-cover` in widget-photo.tsx

  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState(1);

  /** Update cropped image dimensions */
  const onCropComplete = (croppedArea: Area, _croppedAreaPixels: Area) => {
    setCroppedArea(croppedArea);
  };

  /** Cancels the cropping session if the user clicks the escape button */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeWidget === identifier) {
        setActiveWidget(null);
      }
    };
    const handleClickOutside = async (event: MouseEvent) => {
      if (
        cropperRef.current &&
        !cropperRef.current.contains(event.target as Node) &&
        croppedArea !== null
      ) {
        await handleImageCropping(identifier, croppedArea);
        setActiveWidget(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    activeWidget,
    identifier,
    setActiveWidget,
    croppedArea,
    handleImageCropping,
  ]);

  /** Calculates dimensions of image */
  // TODO: un-disable this
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calculateDimensions = (content: PhotoWidgetContentType) => {
    const img = new Image();
    img.src = (content as PhotoWidgetContentType).image;

    if (img.width < img.height && img.width <= widgetDimensions.width) {
      // scale up image's width to match widget's width
      setZoom(img.width / widgetDimensions.width);
    } else if (
      img.width > img.height &&
      img.height <= widgetDimensions.height
    ) {
      // scale up image's height to match widget's height
      setZoom(img.height / widgetDimensions.height);
    } else if (img.width < img.height && img.width > widgetDimensions.width) {
      // shrink down image's width to match widget's width
      setZoom(widgetDimensions.width / img.width);
    } else if (img.width > img.height && img.height > widgetDimensions.height) {
      // shrink down image's height to match widget's height
      setZoom(widgetDimensions.height / img.height);
    }

    setHeight(img.height);
    setWidth(img.width);
  };

  useEffect(() => {
    calculateDimensions(content as PhotoWidgetContentType);
  }, [content, calculateDimensions]);

  return (
    <Transition appear={true} show={true}>
      <div
        className='rounded-3xl transition duration-300 ease-in data-[closed]:opacity-0'
        key={identifier}
        ref={cropperRef}
        style={{
          // Styling must be absolute in order to get widget in the same position it was before cropping was active
          position: 'absolute',
          left: `${
            Math.max(item.x, 0) * (widgetDimensions.width / item.w) -
            (width > height ? width * zoom - widgetDimensions.width : 0) +
            margins[0]
          }px`,
          top: `${
            Math.max(item.y, 0) * (widgetDimensions.height / item.h) -
            (height > width ? height * zoom - widgetDimensions.height : 0) +
            margins[0]
          }px`,
        }}
      >
        <Cropper
          style={{
            // we increase the container size by 2x so upscaled image isn't cropped at any point
            containerStyle: {
              position: 'relative',
              height: `${
                height > width
                  ? widgetDimensions.height +
                    (height * zoom - widgetDimensions.height) * 2
                  : widgetDimensions.height
              }px`,
              width: `${
                width > height
                  ? widgetDimensions.width +
                    (width * zoom - widgetDimensions.width) * 2
                  : widgetDimensions.width
              }px`,
              background: 'transparent',
            },
            cropAreaStyle: {
              border: '3px solid black',
              borderRadius: '1.5rem',
              color: 'transparent',
            },
            // we need to resize the image manually with mediaStyle to have the overflow appear similar to Bento
            mediaStyle: {
              height: `${
                height > width ? height * zoom : widgetDimensions.height
              }px`,
              width: `${
                width > height ? width * zoom : widgetDimensions.width
              }px`,
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
          className={cn(
            `absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transform`,
            isPopoverOpen
              ? ''
              : 'opacity-0 transition-opacity duration-300 hover:opacity-100'
          )}
          style={{
            top: `calc(50% + ${widgetDimensions.height / 2}px)`, // Adjusting the top position
          }}
        >
          <div className='flex flex-row gap-1'>
            <ResizeWidget
              redirectUrl={redirectUrl}
              // Disable the functionality of the following functions (editing links, resizing)
              // if users are actively cropping
              onResize={undefined}
              onEditLink={undefined}
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
