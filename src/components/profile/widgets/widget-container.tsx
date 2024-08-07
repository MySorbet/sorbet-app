import { Spinner } from '../../common';
import styles from './react-grid-layout-custom.module.css';
import { Widget } from './widget';
import { NoWidgetsContent } from '@/components';
import { AddWidgets } from '@/components/profile/widgets';
import { DesktopOnlyAlert } from '@/components/profile/widgets';
import { parseWidgetTypeFromUrl } from '@/components/profile/widgets';
import { useToast } from '@/components/ui/use-toast';
import {
  useDeleteWidget,
  useGetWidgetContent,
  useGetWidgetsForUser,
  useUpdateWidgetsBulk,
  useUploadWidgetsImage,
} from '@/hooks';
import {
  ExtendedWidgetLayout,
  getWidgetDimensions,
  UpdateWidgetsBulkDto,
  WidgetDimensions,
  WidgetDto,
  WidgetSize,
  WidgetType,
} from '@/types';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);
const breakpoints = {
  xxs: 240,
  xs: 480,
  sm: 768,
  md: 996,
  lg: 1200,
  xl: 1600,
};

interface WidgetContainerProps {
  rowHeight?: number;
  editMode: boolean;
  userId: string;
  onLayoutChange?: (layout: any) => void;
}

/**
 * Root component which renders all widgets and link input to add new widgets.
 */
export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  rowHeight = 120,
  editMode,
  userId,
  onLayoutChange = () => {},
}) => {
  const [layout, setLayout] = useState<ExtendedWidgetLayout[]>([]);
  const [initialLayout, setInitialLayout] = useState<ExtendedWidgetLayout[]>(
    []
  );
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [addingWidget, setAddingWidget] = useState<boolean>(false);
  const [cols, setCols] = useState<number>(8);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const widgetRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const [animationStyles, setAnimationStyles] = useState<{
    [key: string]: { width: number; height: number };
  }>({});
  const { toast } = useToast();

  const { mutateAsync: uploadWidgetsImageAsync } = useUploadWidgetsImage();
  const { mutateAsync: updateWidgetsBulk } = useUpdateWidgetsBulk();
  const { mutateAsync: deleteWidget } = useDeleteWidget();
  const { mutateAsync: getWidgetContent } = useGetWidgetContent();
  const { data: userWidgetData, isPending: isUserWidgetPending } =
    useGetWidgetsForUser(userId);

  const generateLayout = useCallback(async (): Promise<
    ExtendedWidgetLayout[]
  > => {
    const userWidgets: WidgetDto[] = userWidgetData;

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
      redirectUrl: widget.redirectUrl,
      size: WidgetSize[widget.size as keyof typeof WidgetSize],
    }));
  }, [userId, editMode, userWidgetData]);

  const handleWidgetResize = (
    key: string,
    w: number,
    h: number,
    widgetSize: WidgetSize
  ) => {
    setLayout((prevLayout) => {
      const newLayout = prevLayout.map((item) => {
        if (item.i === key) {
          return { ...item, w, h, size: widgetSize };
        }
        return item;
      });
      persistWidgetsLayoutOnChange(newLayout);
      return newLayout;
    });
  };

  const handleWidgetRemove = async (key: string) => {
    await deleteWidget(key);
    setLayout((prevLayout) => {
      const newLayout = prevLayout.filter((item) => item.i !== key);
      if (newLayout.length > 0) {
        persistWidgetsLayoutOnChange(newLayout);
      }
      return newLayout;
    });
  };

  const handleWidgetAdd = async (url: string, image: File | undefined) => {
    setAddingWidget(true);
    setError(null);
    let widgetUrl: string = url;

    try {
      const type = parseWidgetTypeFromUrl(url);

      // We're attempting to add a photo widget
      if (type === WidgetType.Photo && image && image !== undefined) {
        const imageFormData = new FormData();
        imageFormData.append('file', image);
        imageFormData.append('fileType', 'image');
        imageFormData.append('destination', 'widgets');
        imageFormData.append('userId', '');
        const response = await uploadWidgetsImageAsync(imageFormData);
        if (response.data && response.data.fileUrl) {
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

      // We're adding a widget that is not a photo
      // So try to fetch required content from the url and persist that content in the database as a new widget
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

      // If you got the content, add the widget to the layout state and persist it in the database
      const widgetToAdd: ExtendedWidgetLayout = {
        i: widget.id,
        x: (layout.length * 2) % cols,
        y: 0,
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

      setLayout((prevLayout) => {
        const newLayout = [...prevLayout, widgetToAdd];
        persistWidgetsLayoutOnChange(newLayout);
        return newLayout;
      });
      setInitialLayout((prevLayout) => [...prevLayout, widgetToAdd]);
    } catch (e) {
      setError('Failed to add widget. Please try again.');
    } finally {
      setAddingWidget(false);
    }
  };

  const generateDOM = () => {
    return layout.map((item) => {
      return (
        <motion.div
          className='widget-motion-wrapper'
          initial={false}
          animate={animationStyles[item.i]}
          style={{ width: '100%', height: '100%' }}
          key={item.i}
          data-grid={item}
          ref={(el) => {
            if (el) widgetRefs.current[item.i] = el;
          }}
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
            redirectUrl={item.redirectUrl}
          />
        </motion.div>
      );
    });
  };

  const handleLayoutChange = (newLayout: ExtendedWidgetLayout[]) => {
    const updatedLayout = newLayout.map((layoutItem) => {
      const existingItem = layout.find((item) => item.i === layoutItem.i);
      return existingItem ? { ...existingItem, ...layoutItem } : layoutItem;
    });

    setLayout(updatedLayout);
    onLayoutChange(updatedLayout);
  };

  const persistWidgetsLayoutOnChange = (items?: ExtendedWidgetLayout[]) => {
    const itemsToUse = items && items.length > 0 ? items : layout;
    if (itemsToUse.length > 0 && editMode) {
      let payload: UpdateWidgetsBulkDto[] = [];
      itemsToUse.map((item) =>
        payload.push({
          id: item.i,
          layout: { h: item.h, w: item.w, x: item.x, y: item.y },
          size: WidgetSize[item.size].toString(),
        })
      );
      updateWidgetsBulk(payload);
    }
  };

  const handleWidgetDropStop = (
    newLayout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    event: MouseEvent,
    element: HTMLElement
  ) => {
    const extendedLayoutObjects: ExtendedWidgetLayout[] = newLayout.map(
      (item) => {
        const layoutItem = layout.find((layoutItem) => layoutItem.i === item.i);
        const extendedItem = {
          ...item,
          type: layoutItem?.type,
          loading: layoutItem?.loading,
          content: layoutItem?.content,
          size: layoutItem?.size,
        };
        return extendedItem as ExtendedWidgetLayout;
      }
    );
    persistWidgetsLayoutOnChange(extendedLayoutObjects);
  };

  useEffect(() => {
    const updateAnimationStyles = () => {
      const newAnimationStyles: {
        [key: string]: { width: number; height: number };
      } = {};
      Object.keys(widgetRefs.current).forEach((key) => {
        const el = widgetRefs.current[key];
        if (el) {
          const { offsetWidth: width, offsetHeight: height } = el;
          newAnimationStyles[key] = { width, height };
        }
      });
      setAnimationStyles(newAnimationStyles);
    };

    updateAnimationStyles();

    window.addEventListener('resize', updateAnimationStyles);
    return () => window.removeEventListener('resize', updateAnimationStyles);
  }, [layout]);

  useEffect(() => {
    const fetchLayout = async () => {
      const layout = await generateLayout();
      setLayout(layout);
      setInitialLayout(layout);
    };

    fetchLayout();
  }, [generateLayout]);

  useEffect(() => {
    setLayout((prevLayout) =>
      prevLayout.map((item) => ({ ...item, static: !editMode }))
    );
  }, [editMode]);

  useEffect(() => {
    let cols = 8;
    switch (currentBreakpoint) {
      case 'xxs':
        cols = 2;
        break;
      case 'xs':
        cols = 2;
        break;
      case 'sm':
        cols = 4;
        break;
      case 'md':
        cols = 6;
        break;
      case 'lg':
      default:
        setCols(8);
        setLayout(initialLayout);
        return;
    }
    setCols(cols);

    setLayout((prevLayout) => {
      let maxY = 0;
      return prevLayout.map((item, index) => {
        const { w, h } = getWidgetDimensions({
          breakpoint: currentBreakpoint,
          size: item.size,
        });
        let x = item.x;
        let y = item.y;
        if (x + w > cols) {
          x = 0;
          y = maxY + 1;
        }
        maxY = Math.max(maxY, y + h);
        return { ...item, w, h, x, y };
      });
    });
  }, [currentBreakpoint, initialLayout]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

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

  if (isUserWidgetPending)
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <Spinner />
      </div>
    );

  return (
    <>
      {layout.length < 1 && editMode && <NoWidgetsContent />}
      <DesktopOnlyAlert />
      <div ref={containerRef}>
        <ReactGridLayout
          layout={layout}
          onLayoutChange={handleLayoutChange}
          className={styles['react-grid-layout-custom']}
          rowHeight={rowHeight}
          margin={[25, 25]}
          cols={cols}
          onDragStop={handleWidgetDropStop}
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
    </>
  );
};
