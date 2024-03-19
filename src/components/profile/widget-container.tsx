import { Widget } from './widget';
import { AddWidgets } from '@/components/profile/add-widgets';
import { getWidgetContent } from '@/lib/service';
import { WidgetDimensions, WidgetSize, WidgetType } from '@/types';
import { parseWidgetTypeFromUrl } from '@/utils/icons';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import type { Layout as WidgetLayout } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

interface WidgetContainerProps {
  className?: string;
  items?: number;
  rowHeight?: number;
  cols?: number;
  editMode: boolean;
  onLayoutChange?: (layout: any) => void;
}

interface ExtendedWidgetLayout extends WidgetLayout {
  type: WidgetType;
  loading?: boolean;
  content?: any;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  className = 'layout',
  items = 1,
  rowHeight = 120,
  cols = 10,
  editMode,
  onLayoutChange = () => {},
}) => {
  const [layout, setLayout] = useState<ExtendedWidgetLayout[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [addingWidget, setAddingWidget] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateLayout = useCallback((): ExtendedWidgetLayout[] => {
    return Array.from({ length: items }, (_, i): ExtendedWidgetLayout => {
      return {
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: WidgetDimensions[WidgetSize.A].w,
        h: WidgetDimensions[WidgetSize.A].h,
        type: WidgetType.Default,
        content: {},
        static: !editMode,
        isResizable: false,
        isDraggable: editMode,
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

  const handleWidgetAdd = async (url: string) => {
    setAddingWidget(true);
    setError(null);
    try {
      const type: WidgetType = parseWidgetTypeFromUrl(url);
      const content = await getWidgetContent({ url, type });

      const widgetToAdd: ExtendedWidgetLayout = {
        i: (layout.length + 1).toString(),
        x: (layout.length * 2) % cols,
        y: Infinity,
        w: WidgetDimensions[WidgetSize.A].w,
        h: WidgetDimensions[WidgetSize.A].h,
        type: type,
        content: content?.data,
        static: !editMode,
        isResizable: false,
        isDraggable: editMode,
        loading: false,
      };

      setLayout((prevLayout) => [...prevLayout, widgetToAdd]);
    } catch (e) {
      setError('Failed to add widget. Please try again.');
    } finally {
      setAddingWidget(false);
    }
  };

  const generateDOM = () => {
    return layout.map((item) => (
      <div key={item.i} data-grid={item}>
        <motion.div
          className='widget-motion-wrapper'
          initial={false}
          animate={{
            height: item.h * rowHeight + 20 * (item.h - 1),
            width: item.w * (containerWidth / cols) - 29,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Widget
            identifier={item.i}
            w={item.w}
            h={item.h}
            type={item.type}
            handleResize={handleWidgetResize}
            handleRemove={handleWidgetRemove}
            editMode={editMode}
            content={item.content}
          />
        </motion.div>
      </div>
    ));
  };

  const handleLayoutChange = (newLayout: ExtendedWidgetLayout[]) => {
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

  useEffect(() => {
    setLayout((prevLayout) =>
      prevLayout.map((item) => ({ ...item, static: !editMode }))
    );
  }, [editMode]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // Display error toast if there is an error
  useEffect(() => {
    if (error) {
      // Replace this with your toast notification library or custom toast component
      alert(error);
    }
  }, [error]);

  return (
    <div ref={containerRef}>
      <ReactGridLayout
        layout={layout}
        onLayoutChange={handleLayoutChange}
        className={`${className} react-grid-layout`}
        rowHeight={rowHeight}
        margin={[25, 25]}
        cols={cols}
        isDraggable={editMode}
        isResizable={editMode}
      >
        {generateDOM()}
      </ReactGridLayout>

      {editMode && (
        <div className='fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-6 z-30'>
          <AddWidgets addUrl={handleWidgetAdd} loading={addingWidget} />
        </div>
      )}
    </div>
  );
};
