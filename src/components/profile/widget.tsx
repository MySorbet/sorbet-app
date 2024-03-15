import { ResizeWidget } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { WidgetSize } from '@/types';
import { getSocialIconForWidget } from '@/utils/icons';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface WidgetProps {
  identifier: string;
  type: string;
  w: number;
  h: number;
  handleResize: (key: string, w: number, h: number) => void;
  handleRemove: (key: string) => void;
  editMode: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
  identifier,
  type,
  handleResize,
  handleRemove,
  editMode,
}) => {
  const [showResizeWidget, setShowResizeWidget] = React.useState(false);

  const onWidgetResize = (w: number, h: number) => {
    handleResize(identifier, w, h);
  };

  return (
    <div
      className='shadow-widget bg-white p-3 flex flex-col rounded-xl w-full h-full relative cursor-pointer z-10 transition-height duration-1500 ease-in-out'
      key={identifier}
      onMouseEnter={() => editMode && setShowResizeWidget(true)}
      onMouseLeave={() => editMode && setShowResizeWidget(false)}
    >
      <div className='mb-4'>
        <img
          src={getSocialIconForWidget(type)}
          alt={type}
          width={30}
          height={30}
        />
      </div>
      <div className='bg-gray-200 p-3 relative h-full rounded-xl'></div>

      <div
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 transition-opacity duration-300 ${
          showResizeWidget ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className='flex flex-row gap-2'>
          <ResizeWidget onResize={onWidgetResize} />
          <Button
            variant='outline'
            size='icon'
            className='rounded-full p-1 bg-gray-800 text-white border-gray-800 hover:bg-gray-800 hover:text-white'
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from propagating to the parent div
              handleRemove(identifier);
            }}
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
