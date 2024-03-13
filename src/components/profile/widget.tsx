import { ResizeWidget } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { getSocialIconForWidget } from '@/utils/icons';
import { Trash2 } from 'lucide-react';
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
  const [showResizeWidget, setShowResizeWidget] = React.useState(true);

  const onWidgetResize = (w: number, h: number) => {
    handleResize(identifier, w, h);
    setShowResizeWidget(false); // Hide the resize widget after resizing
  };

  return (
    <div
      className='bg-white p-3 flex flex-col rounded-xl w-full h-full relative cursor-pointer z-10 transition-height duration-1500 ease-in-out'
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
        <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4'>
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
              <Trash2 size={22} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
