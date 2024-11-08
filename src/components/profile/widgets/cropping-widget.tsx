import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Transition } from '@headlessui/react';

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
  // const [isShowing, setIsShowing] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState(1);

  /** Update cropped image dimensions */
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedArea);
  };

  useEffect(() => {
    /** Cancels the cropping session if the user clicks the escape button */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeWidget === identifier) {
        setActiveWidget(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeWidget, identifier]);

  // Disable the functionality of the following functions (editing links, resizing)
  // if users are actively cropping

  const onWidgetResize = (w: number, h: number, widgetSize: WidgetSize) => {};

  const onWidgetLinkEdit = (url: string) => {};

  /** Calculates the initial values of the zoom and offset to match the display of the photo widget when croppping mode isn't active
   * (since 'object-cover' in react-easy-crop functions and warps ratios) */
  const calculateDimensions = (content: PhotoWidgetContentType) => {
    const img = new Image();
    img.src = (content as PhotoWidgetContentType).image;
    let initialZoom = 1;
    let heightRatio = 0;
    let widthRatio = 0;

    if (img.height > widgetDimensions.height) {
      heightRatio = widgetDimensions.height / img.height;
    } else {
      heightRatio = img.height / widgetDimensions.height;
      initialZoom = widgetDimensions.height / img.height;
    }

    setHeight(img.height);
    setWidth(img.width);
  };

  const calculateHeightRatio = (height: number) => {
    if (height > widgetDimensions.height) {
      return widgetDimensions.height / height;
    }
    return height / widgetDimensions.height;
  };

  const calculateScaleFactor = (height: number) => {
    if (height <= widgetDimensions.height) {
      return widgetDimensions.height / height;
    }
    return 1;
  };

  useEffect(() => {
    calculateDimensions(content as PhotoWidgetContentType);
  }, [content]);

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
            item.y * rowHeight +
            margins[1] * Math.max(0, item.y + 1) -
            Math.max(
              0,
              (height * calculateHeightRatio(height) -
                widgetDimensions.height) /
                2
            )
          }px`,
        }}
      >
        <Cropper
          style={{
            // For the overflow dimensions, take the higher of either image's height/width or the widget's normal height/width
            containerStyle: {
              position: 'relative',
              height: `${Math.max(
                widgetDimensions.height,
                height * calculateHeightRatio(height)
              )}px`,
              width: `${width * calculateScaleFactor(height) * 2}px`,
              background: 'transparent',
              // borderRadius: '1.5rem',
              // border: '3px solid black',
            },
            cropAreaStyle: {
              border: '3px solid black',
              borderRadius: '1.5rem',
              color: 'transparent',
            },
            mediaStyle: {
              height: `${height * calculateScaleFactor(height)}px`,
              width: `${width * calculateScaleFactor(height)}px`,
              borderRadius: '1.5rem',
            },
          }}
          image={(content as PhotoWidgetContentType)?.image}
          crop={crop}
          // zooming is disabled, but an initial zoom is still needed to visually match initial image views
          zoom={zoom}
          aspect={3 / 3}
          // cropSize (the dimensions of the eventual cropped image) must always be the widget dimensions
          cropSize={{
            width: widgetDimensions.width,
            height: widgetDimensions.height,
          }}
          showGrid={false}
          onCropChange={setCrop}
          //  minZoom={-1}
          // onZoomChange={setZoom}
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
