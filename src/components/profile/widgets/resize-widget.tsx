import {
  Crop,
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from 'lucide-react';
import React, { useState } from 'react';
import { Area } from 'react-easy-crop';

import { AddLink } from '@/components/profile/widgets/add-link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { WidgetDimensions, WidgetSize, WidgetType } from '@/types';

interface ResizeWidgetProps {
  onResize?: (w: number, h: number, widgetSize: WidgetSize) => void;
  isAddLinkOpen: boolean;
  redirectUrl?: string;
  setIsAddLinkOpen: (open: boolean) => void;
  onEditLink?: (url: string) => void;
  setActiveWidget: (identifier: string | null) => void;
  activeWidget: string | null;
  identifier: string;
  initialSize: WidgetSize;
  croppedArea?: Area | null;
  handleImageCropping?: (key: string, croppedArea: Area) => Promise<void>;
  type: WidgetType;
  photoDimensions?: { w: number; h: number };
}

export const ResizeWidget: React.FC<ResizeWidgetProps> = ({
  onResize,
  isAddLinkOpen,
  setIsAddLinkOpen,
  onEditLink,
  setActiveWidget,
  handleImageCropping,
  redirectUrl,
  identifier,
  activeWidget,
  initialSize = 'A',
  croppedArea,
  type,
  photoDimensions,
}) => {
  const [currentSize, setCurrentSize] = useState<WidgetSize>(initialSize);

  const btnClass = 'h-7 w-7 flex items-center justify-center';
  const dividerClass =
    'h-4 w-[2.5px] bg-[rgba(135,100,231,1)] rounded-full mx-2';

  const onResizeClick = (
    event: React.MouseEvent<HTMLElement>,
    widgetSize: WidgetSize
  ) => {
    event.stopPropagation();
    if (!activeWidget && onResize) {
      onResize(
        WidgetDimensions[widgetSize].w,
        WidgetDimensions[widgetSize].h,
        widgetSize
      );
      setCurrentSize(widgetSize);
    }
  };

  const onSubmitLink = (link: string) => {
    if (onEditLink) {
      onEditLink(link);
    }
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
    if (!isAddLinkOpen) {
      setIsAddLinkOpen(false); // Close the popover when the widget is no longer hovered
    }
  };

  /** Similar to Bento, don't let users crop images if it's a square image + widget */
  const isSquare = () => {
    return (
      photoDimensions &&
      photoDimensions.w === photoDimensions.h &&
      (initialSize === 'A' || initialSize === 'B')
    );
  };

  return (
    <div
      className={cn(
        'align-center z-20 flex flex-row items-center justify-center rounded-full bg-[#573DF5] text-white md:flex',
        type === 'Photo' ? 'min-w-[205px]' : 'min-w-[140px]',
        isAddLinkOpen ? 'opacity-100' : '' // Control visibility based on popover state
      )}
      onMouseLeave={handleMouseLeave} // Close popover on mouse leave
    >
      <button
        className={btnClass}
        onClick={(e) => {
          onResizeClick(e, 'A');
        }}
      >
        <Square
          size={16}
          fill={currentSize === 'A' && !activeWidget ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </button>
      <div
        className={btnClass}
        onClick={(e) => {
          onResizeClick(e, 'B');
        }}
      >
        <Square
          size={22}
          fill={currentSize === 'B' && !activeWidget ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>
      <div
        className={btnClass}
        onClick={(e) => {
          onResizeClick(e, 'C');
        }}
      >
        <RectangleHorizontal
          size={16}
          fill={currentSize === 'C' && !activeWidget ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>
      <div
        className={btnClass}
        onMouseDown={(e) => {
          onResizeClick(e, 'D');
        }}
      >
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
          <>
            {isSquare() ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className={cn(
                        btnClass,
                        activeWidget ? 'rounded-md bg-[#0ACF83]' : ''
                      )}
                    >
                      <Crop size={20} strokeWidth={2.5} color='#667085' />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Fits perfectly already</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div
                className={cn(
                  btnClass,
                  activeWidget ? 'rounded-md bg-[#0ACF83]' : ''
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  startCropping();
                }}
              >
                <Crop size={20} strokeWidth={2.5} />
              </div>
            )}
          </>
          <div
            className={cn(btnClass, isAddLinkOpen ? 'rounded-md bg-white' : '')}
          >
            <AddLink
              initialValue={redirectUrl ?? ''}
              onSubmit={onSubmitLink}
              isAddLinkOpen={isAddLinkOpen}
              setIsAddLinkOpen={setIsAddLinkOpen}
            />
          </div>
        </>
      )}
    </div>
  );
};
