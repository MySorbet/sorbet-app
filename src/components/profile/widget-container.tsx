import { Widget } from './widget';
import { AddWidgets } from '@/components/profile/add-widgets';
import { parseWidgetTypeFromUrl } from '@/utils/icons';
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

interface ExtendedWidgetLayout extends WidgetLayout {
  type: string;
  url?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  className = 'layout',
  items = 1,
  rowHeight = 60,
  onLayoutChange = () => {},
  cols = 12,
}) => {
  const [layout, setLayout] = useState<ExtendedWidgetLayout[]>([]);

  const generateLayout = useCallback((): ExtendedWidgetLayout[] => {
    return Array.from({ length: items }, (_, i): ExtendedWidgetLayout => {
      return {
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: 3,
        h: 4,
        type: 'dribbble',
        url: 'https://dribbble.com/shots/23768759-Girl-s-portrait',
        static: false,
        isResizable: false,
      };
    });
  }, [items]);

  const handleWidgetResize = (key: string, w: number, h: number) => {
    setLayout((prevLayout) => {
      return prevLayout.map((item) => {
        if (item.i === key) {
          return { ...item, w, h };
        }
        return item;
      });
    });
  };

  const handleWidgetRemove = (key: string) => {
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== key));
  };

  const handleWidgetAdd = (url: string) => {
    const type = parseWidgetTypeFromUrl(url).toLowerCase();
    const widgetToAdd: ExtendedWidgetLayout = {
      i: (layout.length + 1).toString(),
      x: (layout.length * 3) % cols,
      y: Infinity,
      w: 3,
      h: 4,
      type: type,
      url: url,
      static: false,
      isResizable: false,
    };

    setLayout((prevLayout) => [...prevLayout, widgetToAdd]);
  };

  const generateDOM = () => {
    return layout.map((item) => (
      <div key={item.i} data-grid={item}>
        <Widget
          identifier={item.i}
          w={item.w}
          h={item.h}
          type={item.type}
          handleResize={handleWidgetResize}
          handleRemove={handleWidgetRemove}
        />
      </div>
    ));
  };

  const handleLayoutChange = (newLayout: ExtendedWidgetLayout[]) => {
    console.log('layout changed', newLayout);
    // Preserve additional properties like type and url by merging new layout with existing layout
    const updatedLayout = newLayout.map((layoutItem) => {
      const existingItem = layout.find((item) => item.i === layoutItem.i);
      return existingItem ? { ...existingItem, ...layoutItem } : layoutItem;
    });
    setLayout(updatedLayout);
    onLayoutChange(updatedLayout);
  };

  useEffect(() => {
    setLayout(generateLayout());
  }, [generateLayout]);

  return (
    <div className='pattern-diagonal-lines pattern-gray-200 pattern-bg-gray-100 pattern-size-4 pattern-opacity-100 bg-gray-200 mb-28'>
      <ReactGridLayout
        layout={layout}
        onLayoutChange={handleLayoutChange}
        className={className}
        rowHeight={rowHeight}
        margin={[20, 20]}
        cols={cols}
      >
        {generateDOM()}
      </ReactGridLayout>

      <div className='fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-6'>
        <AddWidgets addUrl={handleWidgetAdd} />
      </div>
    </div>
  );
};
