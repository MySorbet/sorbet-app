import React, { useState } from 'react';
import {
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Crop,
} from 'lucide-react';
import { WidgetDimensions, WidgetSize } from '@/types';
import { AddLink } from '@/components/profile/widgets/add-link';
import { CropImageDialog } from '@/components/profile/widgets/crop-image-dialog';

interface ResizeWidgetProps {
  onResize: (w: number, h: number, widgetSize: WidgetSize) => void;
  popoverOpen: boolean;
  redirectUrl?: string;
  setPopoverOpen: (open: boolean) => void;
  onEditLink: (url: string) => void;
  setActiveWidget: (identifier: string | null) => void;
  activeWidget: string | null;
  identifier: string;
  // handleImageCropping: any;
  // zoom: number;
  // offsets: any;
  initialSize: WidgetSize;
}

export const ResizeWidget: React.FC<ResizeWidgetProps> = ({
  onResize,
  popoverOpen,
  setPopoverOpen,
  onEditLink,
  setActiveWidget,
  // handleImageCropping,
  redirectUrl,
  identifier,
  activeWidget,
  initialSize = 'A',
  // zoom,
  // offsets,
}) => {
  const [currentSize, setCurrentSize] = useState<WidgetSize>(initialSize);
  const [currentLink, setCurrentLink] = useState<string>(
    redirectUrl ? redirectUrl : ''
  );
  // const [popoverOpen, setPopoverOpen] = useState(false); // Track popover visibility

  const btnClass = 'h-4 w-7 flex items-center justify-center';
  const dividerClass =
    'h-4 w-[2.5px] bg-[rgba(135,100,231,1)] rounded-full mx-2';

  const onResizeClick = (
    event: React.MouseEvent<HTMLElement>,
    widgetSize: WidgetSize
  ) => {
    event.stopPropagation();
    onResize(
      WidgetDimensions[widgetSize].w,
      WidgetDimensions[widgetSize].h,
      widgetSize
    );
    setCurrentSize(widgetSize);
  };

  const onSubmitLink = () => {
    onEditLink(currentLink);
  };

  const startCropping = () => {
    if (activeWidget) {
      // handleImageCropping(identifier, zoom, offsets);
      setActiveWidget(null);
    } else {
      setActiveWidget(identifier);
    }
  };

  const handleMouseLeave = () => {
    setPopoverOpen(false); // Close the popover when the widget is no longer hovered
  };

  return (
    <div
      className='align-center z-20 flex hidden min-w-[205px] cursor-pointer flex-row items-center justify-center rounded-full bg-[#573DF5] text-white group-hover:flex md:flex'
      onMouseLeave={handleMouseLeave} // Close popover on mouse leave
    >
      <button className={btnClass} onClick={(e) => onResizeClick(e, 'A')}>
        <Square
          size={16}
          fill={currentSize === 'A' ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </button>
      <div className={btnClass} onClick={(e) => onResizeClick(e, 'B')}>
        <Square
          size={22}
          fill={currentSize === 'B' ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>
      <div className={btnClass} onClick={(e) => onResizeClick(e, 'C')}>
        <RectangleHorizontal
          size={16}
          fill={currentSize === 'C' ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>
      <div className={btnClass} onClick={(e) => onResizeClick(e, 'D')}>
        <RectangleVertical
          size={16}
          fill={currentSize === 'D' ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>

      <div className={dividerClass} />
      <div
        className={btnClass}
        onClick={(e) => {
          e.stopPropagation;
          startCropping();
        }}
      >
        <Crop size={20} strokeWidth={2.5} />
      </div>
      <div className={btnClass}>
        <AddLink
          value={currentLink}
          onChange={setCurrentLink}
          onSubmission={onSubmitLink}
          popoverOpen={popoverOpen}
          setPopoverOpen={setPopoverOpen}
        />
      </div>
    </div>
  );
};
