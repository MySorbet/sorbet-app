import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  LinkWidgetContentType,
  PhotoWidgetContentType,
  WidgetContentType,
  WidgetLayoutItem,
  WidgetSize,
  WidgetType,
} from '@/types';

import { ResizeWidget } from './resize-widget';
import { LinkWidget } from './widget-link';
import { PhotoWidget } from './widget-photo';
import Cropper, { Area, MediaSize } from 'react-easy-crop';

interface CroppingWidgetProps {
  identifier: string;
  type: WidgetType;
  w: number;
  item: WidgetLayoutItem;
  h: number;
  content?: WidgetContentType;
  loading?: boolean;
  initialSize?: WidgetSize;
  redirectUrl?: string;
  draggedRef: React.MutableRefObject<boolean>;
  showControls?: boolean;
  handleResize: (key: string, w: number, h: number, size: WidgetSize) => void;
  handleRemove: (key: string) => void;
  handleImageCropping: any;
  handleEditLink: (key: string, url: string) => void;
  setActiveWidget: (widgetId: string | null) => void;
  activeWidget: string | null;
  widgetDimensions: {
    width: number;
    height: number;
  };
  addUrl: any;
  rowHeight: any;
  margins: any;
  cols: number;
}

export const CroppingWidget: React.FC<CroppingWidgetProps> = ({
  identifier,
  type,
  loading,
  content,
  redirectUrl,
  initialSize = 'A',
  showControls = false,
  handleResize,
  handleRemove,
  handleImageCropping,
  handleEditLink,
  draggedRef,
  setActiveWidget,
  activeWidget,
  widgetDimensions,
  rowHeight,
  margins,
  item,
  addUrl,
  cols,
}) => {
  const [widgetSize, setWidgetSize] = useState<WidgetSize>(initialSize);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [widgetContent, setWidgetContent] = useState<React.ReactNode>(
    <>None</>
  );

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const [height, setHeight] = useState(1);
  const [width, setWidth] = useState(1);

  /** update image dimensions */
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log('here', croppedArea, zoom, crop);
    setCroppedArea(croppedArea);
  };

  const onWidgetResize = (w: number, h: number, widgetSize: WidgetSize) => {
    // handleResize(identifier, w, h, widgetSize);
    // setWidgetSize(widgetSize);
  };

  const onWidgetLinkEdit = (url: string) => {
    // handleEditLink(identifier, url);
  };

  const onWidgetClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const dragged = draggedRef.current;
    draggedRef.current = false;
    if (!dragged) {
      if (redirectUrl) {
        const newWindow = window.open(redirectUrl, '_blank');
        if (newWindow) {
          newWindow.opener = null;
        }
      }
    }
    // TODO: Maybe widgets should be anchors?
  };

  const calculateMarginOffset = (
    margins: any,
    item: WidgetLayoutItem,
    cols: number
  ) => {
    if (cols - item.w === item.x) {
      return Math.max(margins[0], margins[0] * (item.x - 2));
    }
    return Math.max(margins[0], margins[0] * (item.x + 1));
  };

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

        setWidgetContent(
          <PhotoWidget
            croppedArea={(content as PhotoWidgetContentType).croppedArea}
            /* offsets={
              (content as PhotoWidgetContentType).offsets
            } */
            // zoom={(content as PhotoWidgetContentType).scale}
            content={content as PhotoWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      case 'Link':
        setWidgetContent(
          <LinkWidget
            identifier={identifier}
            addUrl={addUrl}
            content={content as LinkWidgetContentType}
            size={widgetSize}
          />
        );
        break;

      default:
        setWidgetContent(<>Unsupported widget type</>);
        break;
    }
  }, [type, widgetSize, content]);
  console.log(zoom);

  return (
    <div
      className={`rounded-3xl`}
      key={identifier}
      style={{
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
          containerStyle: {
            position: 'relative',
            height: `${Math.min(
              Math.max(widgetDimensions.height, height),
              700
            )}px`,
            width: `${Math.min(
              Math.max(widgetDimensions.width, width),
              700
            )}px`,
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
        cropSize={{
          width: widgetDimensions.width,
          height: widgetDimensions.height,
        }}
        showGrid={false}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        objectFit='vertical-cover'
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
          />
          <Button
            variant='outline'
            size='icon'
            className='rounded-full border-gray-800 bg-gray-800 text-white hover:bg-gray-800 hover:text-white'
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(identifier);
            }}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
