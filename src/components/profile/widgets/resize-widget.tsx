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
  initialSize = 'A',
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
    <div className='cursor-pointer bg-[#573DF5] flex flex-row text-white rounded-full justify-center align-center items-center min-w-[140px] z-20 hidden md:flex'>
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
    </div>
  );
};
