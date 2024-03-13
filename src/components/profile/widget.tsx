import { ResizeWidget } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { getSocialIconForWidget } from '@/utils/icons';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface WidgetProps {
  identifier: string;
  type: string;
  w: number;
  h: number;
  handleResize: (key: string, w: number, h: number) => void;
  handleRemove: (key: string) => void;
}

export const Widget: React.FC<WidgetProps> = ({
  identifier,
  type,
  handleResize,
  handleRemove,
}) => {
  const [showResizeWidget, setShowResizeWidget] = React.useState(false);

  const onWidgetResize = (w: number, h: number) => {
    handleResize(identifier, w, h);
  };

  return (
    <div
      className='bg-white p-3 flex flex-col rounded-xl w-full h-full relative cursor-pointer z-10'
      key={identifier}
      onMouseEnter={() => setShowResizeWidget(true)}
      onMouseLeave={() => setShowResizeWidget(false)}
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

      {showResizeWidget && (
        <div
          className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4'
          onClick={() => setShowResizeWidget(true)}
        >
          <div className='flex flex-row gap-2'>
            <ResizeWidget onResize={onWidgetResize} />
            <Button
              variant='outline'
              size='icon'
              className='rounded-full p-1 bg-gray-800 text-white border-gray-800 hover:bg-gray-800 hover:text-white'
              onClick={() => handleRemove(identifier)}
            >
              <Trash2 size={22} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
