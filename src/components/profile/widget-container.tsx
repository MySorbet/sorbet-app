import { Widget } from './widget';
import { uploadWidgetsImageAsync } from '@/api/images';
import { AddWidgets } from '@/components/profile/add-widgets';
import { useToast } from '@/components/ui/use-toast';
import {
  deleteWidget,
  getWidgetContent,
  getWidgetsForUser,
  updateWidget,
  updateWidgetsBulk,
} from '@/lib/service';
import {
  ExtendedWidgetLayout,
  UpdateWidgetsBulkDto,
  WidgetDimensions,
  WidgetDto,
  WidgetSize,
  WidgetType,
} from '@/types';
import { parseWidgetTypeFromUrl } from '@/utils/icons';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);
const breakpoints = {
  xs: 480,
  sm: 768,
  md: 996,
  lg: 1200,
};

interface WidgetContainerProps {
  className?: string;
  items?: number;
  rowHeight?: number;
  cols?: number;
  editMode: boolean;
  userId: string;
  onLayoutChange?: (layout: any) => void;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  className = 'layout',
  items = 0,
  rowHeight = 120,
  cols = 8,
  editMode,
  userId,
  onLayoutChange = () => {},
}) => {
  const [layout, setLayout] = useState<ExtendedWidgetLayout[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [addingWidget, setAddingWidget] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const { toast } = useToast();

  const generateLayout = useCallback(async (): Promise<
    ExtendedWidgetLayout[]
  > => {
    const userWidgets: WidgetDto[] = await getWidgetsForUser(userId);
    if (!userWidgets || userWidgets.length < 1) return [];

    return userWidgets.map((widget: WidgetDto, i: number) => ({
      i: widget.id,
      x: widget.layout.x,
      y: widget.layout.y,
      w: WidgetDimensions[WidgetSize[widget.size as keyof typeof WidgetSize]].w,
      h: WidgetDimensions[WidgetSize[widget.size as keyof typeof WidgetSize]].h,
      type: WidgetType[widget.type as keyof typeof WidgetType],
      content: widget.content,
      static: !editMode,
      isResizable: false,
      isDraggable: editMode,
      size: WidgetSize[widget.size as keyof typeof WidgetSize],
    }));
  }, [userId, editMode]);

  const handleWidgetResize = (
    key: string,
    w: number,
    h: number,
    widgetSize: WidgetSize
  ) => {
    setLayout((prevLayout) => {
      return prevLayout.map((item) => {
        if (item.i === key) {
          return { ...item, w, h, size: widgetSize };
        }
        return item;
      });
    });
  };

  const handleWidgetRemove = async (key: string) => {
    await deleteWidget(key);
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== key));
  };

  const handleWidgetAdd = async (url: string, image: File | undefined) => {
    setAddingWidget(true);
    setError(null);
    let widgetUrl: string = url;

    try {
      const type: WidgetType = parseWidgetTypeFromUrl(url);

      if (type === WidgetType.Photo && image && image !== undefined) {
        const imageFormData = new FormData();
        imageFormData.append('file', image);
        imageFormData.append('fileType', 'image');
        imageFormData.append('destination', 'widgets');
        imageFormData.append('userId', '');

        const response = await uploadWidgetsImageAsync(imageFormData);
        if (
          response.status === 'success' &&
          response.data &&
          response.data.fileUrl
        ) {
          widgetUrl = response.data.fileUrl;
        } else {
          toast({
            title: 'Widget image not upload',
            description:
              'Your widget image could not be saved due to an error. Please try again.',
          });
          return;
        }
      }

      let widget: any;
      try {
        widget = await getWidgetContent({ url: widgetUrl, type });
      } catch (error) {
        toast({
          title: 'Failed to add widget',
          description: 'If the issue persists, contact support',
        });
        return;
      }

      const widgetToAdd: ExtendedWidgetLayout = {
        i: widget.id,
        x: (layout.length * 2) % cols,
        y: Infinity,
        w: WidgetDimensions[WidgetSize.A].w,
        h: WidgetDimensions[WidgetSize.A].h,
        type: type,
        content: widget.content,
        static: !editMode,
        isResizable: false,
        isDraggable: editMode,
        loading: false,
        size: WidgetSize.A,
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
      <motion.div
        className='widget-motion-wrapper'
        initial={false}
        animate={{
          height: item.h * rowHeight + 25 * (item.h - 1),
          width: item.w * (containerWidth / cols) - 30,
        }}
        style={{ width: '100%', height: '100%' }}
        key={item.i}
        data-grid={item}
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
          initialSize={item.size}
        />
      </motion.div>
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
    const fetchLayout = async () => {
      const layout = await generateLayout();
      setLayout(layout);
    };

    fetchLayout();
  }, [generateLayout]);

  useEffect(() => {
    setLayout((prevLayout) =>
      prevLayout.map((item) => ({ ...item, static: !editMode }))
    );
  }, [editMode]);

  useEffect(() => {
    if (layout.length > 0 && editMode) {
      let payload: UpdateWidgetsBulkDto[] = [];
      layout.map((item) =>
        payload.push({
          id: item.i,
          layout: { h: item.h, w: item.w, x: item.x, y: item.y },
          size: WidgetSize[item.size].toString(),
        })
      );
      updateWidgetsBulk(payload);
    }
  }, [layout]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  useEffect(() => {
    const calculateBreakpoint = () => {
      const width = window.innerWidth;
      let breakpoint = 'lg';
      if (width < breakpoints.xs) breakpoint = 'xs';
      else if (width >= breakpoints.xs && width < breakpoints.sm)
        breakpoint = 'sm';
      else if (width >= breakpoints.sm && width < breakpoints.md)
        breakpoint = 'md';
      else if (width >= breakpoints.md && width < breakpoints.lg)
        breakpoint = 'lg';

      if (breakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(breakpoint);
      }
    };

    calculateBreakpoint();

    window.addEventListener('resize', calculateBreakpoint);

    return () => window.removeEventListener('resize', calculateBreakpoint);
  }, [window.innerWidth]);

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
