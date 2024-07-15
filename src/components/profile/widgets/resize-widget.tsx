import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { WidgetSize, WidgetDimensions } from '@/types';
import { Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import React, { useState } from 'react';

interface ResizeWidgetProps {
  onResize: (w: number, h: number, widgetSize: WidgetSize) => void;
  initialSize: WidgetSize;
}

export const ResizeWidget: React.FC<ResizeWidgetProps> = ({
  onResize,
  initialSize = WidgetSize.A,
}) => {
  const [currentSize, setCurrentSize] = useState<WidgetSize>(initialSize);
  const btnClass = 'h-4 w-7 flex items-center justify-center';

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

  return (
    <div className='cursor-pointer bg-[#573DF5] flex flex-row text-white rounded-full justify-center align-center items-center min-w-[140px] z-20 hidden lg:flex'>
      <button
        className={btnClass}
        onClick={(e) => onResizeClick(e, WidgetSize.A)}
      >
        <Square
          size={16}
          fill={currentSize === WidgetSize.A ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </button>
      <div className={btnClass} onClick={(e) => onResizeClick(e, WidgetSize.B)}>
        <Square
          size={22}
          fill={currentSize === WidgetSize.B ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>
      <div className={btnClass} onClick={(e) => onResizeClick(e, WidgetSize.C)}>
        <RectangleHorizontal
          size={16}
          fill={currentSize === WidgetSize.C ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>
      <div className={btnClass} onClick={(e) => onResizeClick(e, WidgetSize.D)}>
        <RectangleVertical
          size={16}
          fill={currentSize === WidgetSize.D ? '#fff' : 'transparent'}
          strokeWidth={2.5}
        />
      </div>
    </div>
  );
};
