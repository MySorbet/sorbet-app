import { Widget } from './widget';
import React, { useState, useEffect, useCallback } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import type { ItemCallback, Layout as WidgetLayout } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

interface WidgetContainerProps {
  className?: string;
  items?: number;
  rowHeight?: number;
  onLayoutChange?: (layout: any) => void;
  cols?: number;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  className = 'layout',
  items = 4,
  rowHeight = 60,
  onLayoutChange = () => {},
  cols = 12,
}) => {
  const [layout, setLayout] = useState<WidgetLayout[]>([]);

  const generateLayout = useCallback((): WidgetLayout[] => {
    return Array.from({ length: items }, (_, i): WidgetLayout => {
      return {
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: 3,
        h: 4,
        static: false,
      };
    });
  }, [items]);

  useEffect(() => {
    setLayout(generateLayout());
  }, [generateLayout]);

  const handleWidgetResize = (key: string, w: number, h: number) => {
    console.log(`Key: ${key}, width: ${w}, height: ${h}`);
    setLayout((prevLayout) => {
      return prevLayout.map((item) => {
        if (item.i === key) {
          return { ...item, w, h };
        }
        return item;
      });
    });
  };

  const generateDOM = () => {
    return layout.map((item) => (
      <div key={item.i} data-grid={item}>
        <Widget
          identifier={item.i}
          w={item.w}
          h={item.h}
          type='Dribbble'
          handleResize={handleWidgetResize}
        />
      </div>
    ));
  };

  const handleLayoutChange = (newLayout: any) => {
    console.log('layout changed', layout);
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const onResize: ItemCallback = (
    layout: WidgetLayout[],
    oldItem: WidgetLayout,
    newItem: WidgetLayout,
    placeholder: WidgetLayout,
    event: MouseEvent,
    element: HTMLElement
  ) => {
    if (newItem.h < 3 && newItem.w > 2) {
      newItem.w = 2;
      placeholder.w = 2;
    }

    if (newItem.h >= 3 && newItem.w < 2) {
      newItem.w = 2;
      placeholder.w = 2;
    }
  };

  return (
    <ReactGridLayout
      layout={layout}
      onLayoutChange={handleLayoutChange}
      className={className}
      rowHeight={rowHeight}
      onResize={onResize}
      margin={[20, 20]}
      cols={cols}
    >
      {generateDOM()}
    </ReactGridLayout>
  );
};
