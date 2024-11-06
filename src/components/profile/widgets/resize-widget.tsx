import {
  Crop,
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from 'lucide-react';
import React, { useState } from 'react';
import { Area } from 'react-easy-crop';

import { AddLink } from '@/components/profile/widgets/add-link';
import { cn } from '@/lib/utils';
import { WidgetDimensions, WidgetSize, WidgetType } from '@/types';

interface ResizeWidgetProps {
  onResize: (w: number, h: number, widgetSize: WidgetSize) => void;
  popoverOpen: boolean;
  redirectUrl?: string;
  setPopoverOpen: (open: boolean) => void;
  onEditLink: (url: string) => void;
  setActiveWidget: (identifier: string | null) => void;
  activeWidget: string | null;
  identifier: string;
  initialSize: WidgetSize;
  croppedArea?: Area | null;
  handleImageCropping?: (key: string, croppedArea: Area) => Promise<void>;
  type: WidgetType;
}

export const ResizeWidget: React.FC<ResizeWidgetProps> = ({
  onResize,
  popoverOpen,
  setPopoverOpen,
  onEditLink,
  setActiveWidget,
  handleImageCropping,
  redirectUrl,
  identifier,
  activeWidget,
  initialSize = 'A',
  croppedArea,
  type,
}) => {
  const [currentSize, setCurrentSize] = useState<WidgetSize>(initialSize);
  const [currentLink, setCurrentLink] = useState<string>(
    redirectUrl ? redirectUrl : ''
  );

  const btnClass = 'h-7 w-7 flex items-center justify-center';
  const dividerClass =
    'h-4 w-[2.5px] bg-[rgba(135,100,231,1)] rounded-full mx-2';

  const onResizeClick = (
    event: React.MouseEvent<HTMLElement>,
    widgetSize: WidgetSize
  ) => {
    event.stopPropagation();
    if (!activeWidget) {
      onResize(
        WidgetDimensions[widgetSize].w,
        WidgetDimensions[widgetSize].h,
        widgetSize
      );
      setCurrentSize(widgetSize);
    }
  };

  const onSubmitLink = () => {
    onEditLink(currentLink);
  };

  const startCropping = async () => {
    if (activeWidget && croppedArea && handleImageCropping) {
      await handleImageCropping(identifier, croppedArea);
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
      className={cn(
        'align-center z-20 flex hidden min-w-[205px] cursor-pointer flex-row items-center justify-center rounded-full bg-[#573DF5] text-white group-hover:flex md:flex',
        type === 'Photo' ? 'min-w-[205px]' : 'min-w-[140px]'
      )}
      onMouseLeave={handleMouseLeave} // Close popover on mouse leave
    >
      <button className={btnClass} onClick={(e) => onResizeClick(e, 'A')}>
        <Square
          size={16}
          fill={currentSize === 'A' && !activeWidget ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </button>
      <div className={btnClass} onClick={(e) => onResizeClick(e, 'B')}>
        <Square
          size={22}
          fill={currentSize === 'B' && !activeWidget ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>
      <div className={btnClass} onClick={(e) => onResizeClick(e, 'C')}>
        <RectangleHorizontal
          size={16}
          fill={currentSize === 'C' && !activeWidget ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>
      <div className={btnClass} onClick={(e) => onResizeClick(e, 'D')}>
        <RectangleVertical
          size={16}
          fill={currentSize === 'D' && !activeWidget ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>

      {/** Only allow for widget links and cropping for Photos */}
      {type === 'Photo' && (
        <>
          <div className={dividerClass} />
          <div
            className={`${btnClass} ${
              activeWidget ? 'rounded-md bg-[#0ACF83]' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation;
              startCropping();
            }}
          >
            <Crop size={20} strokeWidth={2.5} />
          </div>
          <div
            className={`${btnClass} ${
              popoverOpen ? 'rounded-md bg-white' : ''
            }`}
          >
            <AddLink
              value={currentLink}
              onChange={setCurrentLink}
              onSubmission={onSubmitLink}
              popoverOpen={popoverOpen}
              setPopoverOpen={setPopoverOpen}
            />
          </div>
        </>
      )}
    </div>
  );
};
