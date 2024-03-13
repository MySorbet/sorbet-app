import { WidgetSize, WidgetDimensions } from '@/types';
import { Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import React from 'react';

interface ResizeWidgetProps {
  onResize: (w: number, h: number) => void;
}

export const ResizeWidget: React.FC<ResizeWidgetProps> = ({ onResize }) => {
  return (
    <div className='cursor-pointer bg-[#573DF5] flex flex-row gap-2 text-white rounded-full justify-center align-center items-center py-1 px-2 max-w-[130px]'>
      <div
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
