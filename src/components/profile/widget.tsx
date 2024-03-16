import { Spinner } from '@/components/common';
import {
  DefaultWidget,
  DribbbleWidget,
  ResizeWidget,
} from '@/components/profile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DribbbleWidgetContentType, WidgetSize, WidgetType } from '@/types';
import { getSocialIconForWidget } from '@/utils/icons';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface WidgetProps {
  identifier: string;
  type: WidgetType;
  w: number;
  h: number;
  editMode: boolean;
  content?: any;
  loading?: boolean;
  handleResize: (key: string, w: number, h: number) => void;
  handleRemove: (key: string) => void;
}

export const Widget: React.FC<WidgetProps> = ({
  identifier,
  type,
  editMode,
  loading,
  content,
  handleResize,
  handleRemove,
}) => {
  const [showResizeWidget, setShowResizeWidget] = useState(false);
  const [widgetSize, setWidgetSize] = useState<WidgetSize>(WidgetSize.A);
  const [widgetContent, setWidgetContent] = useState<React.ReactNode>(
    <>None</>
  );

  const onWidgetResize = (w: number, h: number, widgetSize: WidgetSize) => {
    handleResize(identifier, w, h);
    setWidgetSize(widgetSize);
  };

  useEffect(() => {
    if (type === WidgetType.Dribbble) {
      setWidgetContent(
        <DribbbleWidget
          content={content as DribbbleWidgetContentType}
          size={widgetSize}
        />
      );
    }

    if (type === WidgetType.Default) {
      setWidgetContent(<DefaultWidget />);
    }
  }, [type]);

  return (
    <>
      {loading && (
        <div className='flex justify-center align-center items-center bg-gray-300 opacity-70 h-full w-full absolute z-50 rounded-xl'>
          <Spinner />
        </div>
      )}
      <div
        className={cn(
          'shadow-widget bg-white p-3 flex flex-col rounded-xl w-full h-full relative cursor-pointer z-10 transition-height duration-1500 ease-in-out'
        )}
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

        {widgetContent}

        <div
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 transition-opacity duration-300 ${
            showResizeWidget ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='flex flex-row gap-1'>
            <ResizeWidget onResize={onWidgetResize} />
            <Button
              variant='outline'
              size='icon'
              className='rounded-full bg-gray-800 text-white border-gray-800 hover:bg-gray-800 hover:text-white'
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(identifier);
              }}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
