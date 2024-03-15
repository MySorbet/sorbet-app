import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { WidgetSize, WidgetDimensions } from '@/types';
import { Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import React from 'react';

interface ResizeWidgetProps {
  onResize: (w: number, h: number) => void;
}

export const ResizeWidget: React.FC<ResizeWidgetProps> = ({ onResize }) => {
  const onResizeClick = (
    event: React.MouseEvent<HTMLElement>,
    widgetSize: WidgetSize
  ) => {
    event.stopPropagation();
    onResize(WidgetDimensions[widgetSize].w, WidgetDimensions[widgetSize].h);
  };

  return (
    <div className='cursor-pointer bg-[#573DF5] flex flex-row text-white rounded-full justify-center align-center items-center min-w-[160px] z-20'>
      <button
        className='h-8 w-8 flex items-center justify-center'
        onClick={(e) => onResizeClick(e, WidgetSize.A)}
      >
        <Square size={16} />
      </button>
      <div
        className='h-8 w-8 flex items-center justify-center'
        onClick={(e) => onResizeClick(e, WidgetSize.B)}
      >
        <Square size={22} />
      </div>
      <div
        className='h-8 w-8 flex items-center justify-center'
        onClick={(e) => onResizeClick(e, WidgetSize.C)}
      >
        <RectangleHorizontal size={16} />
      </div>
      <div
        className='h-8 w-8 flex items-center justify-center'
        onClick={(e) => onResizeClick(e, WidgetSize.D)}
      >
        <RectangleVertical size={16} />
      </div>
    </div>
  );
};
