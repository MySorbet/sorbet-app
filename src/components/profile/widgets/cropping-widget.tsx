import { Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  PhotoWidgetContentType,
  WidgetContentType,
  WidgetLayoutItem,
  WidgetSize,
  WidgetType,
} from '@/types';

import { ResizeWidget } from './resize-widget';
import Cropper, { Area, MediaSize } from 'react-easy-crop';

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
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState(1);

  /** Update cropped image dimensions */
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log('here', croppedArea, zoom, crop);
    setCroppedArea(croppedArea);
  };

  /** Cancels the cropping session if the user clicks away from the active widget */
  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      if (activeWidget === identifier) {
        setActiveWidget(null);
      }
    },
    [activeWidget, identifier, setActiveWidget]
  );

  useEffect(() => {
    /** Cancels the cropping session if the user clicks the escape button */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeWidget === identifier) {
        setActiveWidget(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickAway);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickAway);
    };
  }, [activeWidget, identifier]);

  // Disable the functionality of the following functions (editing links, resizing)
  // if users are actively cropping

  const onWidgetResize = (w: number, h: number, widgetSize: WidgetSize) => {};

  const onWidgetLinkEdit = (url: string) => {};

  const calculateMarginOffset = (
    margins: [number, number],
    item: WidgetLayoutItem,
    cols: number
  ) => {
    if (cols - item.w === item.x) {
      return Math.max(margins[0], margins[0] * (item.x - 2));
    }
    return Math.max(margins[0], margins[0] * item.x);
  };

  /** Calculates the initial values of the zoom and offset to match the display of the photo widget when croppping mode isn't active
   * (since 'object-cover' in react-easy-crop functions and warps ratios) */
  const calculateScaleFactor = (content: PhotoWidgetContentType) => {
    const containerRatio = widgetDimensions.width / widgetDimensions.height;
    const img = new Image();
    img.src = (content as PhotoWidgetContentType).image;

    const imageRatio = img.width / img.height;

    let offsets = { x: 0, y: 0 };
    let widthRatio = 0;
    let heightRatio = 0;

    if (img.height < widgetDimensions.height) {
      heightRatio = widgetDimensions.height / img.height;
    } else {
      heightRatio = img.height / widgetDimensions.height;
    }

    if (img.width < widgetDimensions.width) {
      widthRatio = widgetDimensions.width / img.width;
    } else {
      widthRatio = img.width / widgetDimensions.width;
    }

    if (imageRatio < containerRatio) {
      // Image is wider than container
      offsets = { x: (img.width - img.height) / 2, y: 0 };
    } else {
      // Image is taller than container
      offsets = { x: 0, y: (img.height - img.width) / 2 };
    }
    console.log(
      widthRatio,
      heightRatio,
      img.width / widgetDimensions.height,
      widgetDimensions.width / img.height,
      widgetDimensions.height / img.width
    );
    setZoom(Math.min(widthRatio, heightRatio));
    setCrop(offsets);
    setHeight(img.height);
    setWidth(img.width);
  };

  useEffect(() => {
    switch (type) {
      case 'Photo':
        if (!(content as PhotoWidgetContentType).croppedArea) {
          calculateScaleFactor(content as PhotoWidgetContentType);
        }
        break;
      default:
        break;
    }
  }, [type, content]);
  console.log(zoom);

  return (
    <div
      className={`rounded-3xl`}
      key={identifier}
      style={{
        /** Styling must be absolute in order to get widget in the same position it was before cropping was active */
        position: 'absolute',
        left: `${
          Math.max(item.x, 0) * (widgetDimensions.width / item.w) +
          calculateMarginOffset(margins, item, cols) -
          Math.max(0, (width - widgetDimensions.width) / 2)
        }px`,
        top: `${
          item.y * rowHeight +
          margins[1] * Math.max(0, item.y + 1) -
          Math.max(0, (height - widgetDimensions.height) / 2)
        }px`,
      }}
    >
      <Cropper
        style={{
          /** For the overflow dimensions, take the higher of either image's height/width or the widget's normal height/width */
          containerStyle: {
            position: 'relative',
            height: `${Math.max(widgetDimensions.height, height)}px`,
            width: `${Math.max(widgetDimensions.width, width)}px`,
            borderRadius: '10px',
          },
          cropAreaStyle: {
            border: '3px solid black',
            borderRadius: '10px',
          },
        }}
        image={(content as PhotoWidgetContentType)?.image}
        crop={crop}
        zoom={zoom}
        aspect={3 / 3}
        /** cropSize (the dimensions of the eventual cropped image) must always be the widget dimensions */
        cropSize={{
          width: widgetDimensions.width,
          height: widgetDimensions.height,
        }}
        showGrid={false}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        maxZoom={10}
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
  );
};
