import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { WidgetSize, WidgetDimensions } from '@/types';
import { Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import React from 'react';

interface ResizeWidgetProps {
  onResize: (w: number, h: number) => void;
}

export const ResizeWidget: React.FC<ResizeWidgetProps> = ({ onResize }) => {
  return (
    <div className='cursor-pointer bg-[#573DF5] flex flex-row text-white rounded-full justify-center align-center items-center min-w-[160px] z-20'>
      <div
        className='h-8 w-8 flex items-center justify-center'
        onClick={() =>
          onResize(
            WidgetDimensions[WidgetSize.A].w,
            WidgetDimensions[WidgetSize.A].h
          )
        }
      >
        <Square size={16} />
      </div>
      <div
        className='h-8 w-8 flex items-center justify-center'
        onClick={() =>
          onResize(
            WidgetDimensions[WidgetSize.B].w,
            WidgetDimensions[WidgetSize.B].h
          )
        }
      >
        <Square size={22} />
      </div>
      <div
        className='h-8 w-8 flex items-center justify-center'
        onClick={() =>
          onResize(
            WidgetDimensions[WidgetSize.C].w,
            WidgetDimensions[WidgetSize.C].h
          )
        }
      >
        <RectangleHorizontal size={16} />
      </div>
      <div
        className='h-8 w-8 flex items-center justify-center'
        onClick={() =>
          onResize(
            WidgetDimensions[WidgetSize.D].w,
            WidgetDimensions[WidgetSize.D].h
          )
        }
      >
        <RectangleVertical size={16} />
      </div>
    </div>
  );
};
