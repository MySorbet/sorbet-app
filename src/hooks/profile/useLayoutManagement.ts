import { useCallback, useEffect, useRef, useState } from 'react';
import { Layout } from 'react-grid-layout';

import { WidgetGridProps } from '@/components/profile/widgets/widget-grid';
import { useGetWidgetsForUser, useUpdateWidgetsBulk } from '@/hooks';
import {
  getWidgetDimensions,
  PhotoWidgetContentType,
  UpdateWidgetsBulkDto,
  WidgetDimensions,
  WidgetDto,
  WidgetLayoutItem,
  WidgetSize,
} from '@/types';

const breakpoints = {
  xxs: 0,
  xs: 550,
  sm: 780,
  md: 1024,
  lg: 1200,
  xl: 1600,
};

export const useLayoutManagement = ({ userId, editMode }: WidgetGridProps) => {
  const [layout, setLayout] = useState<WidgetLayoutItem[]>([]);
  const [initialLayout, setInitialLayout] = useState<WidgetLayoutItem[]>([]);
  const [cols, setCols] = useState<number>(8);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [animationStyles, setAnimationStyles] = useState<{
    [key: string]: { width: number; height: number };
  }>({});

  const widgetRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  const { data: userWidgetData, isPending: isUserWidgetPending } =
    useGetWidgetsForUser(userId);
  const { mutateAsync: updateWidgetsBulk } = useUpdateWidgetsBulk();

  const generateLayout = useCallback(async (): Promise<WidgetLayoutItem[]> => {
    const userWidgets: WidgetDto[] = userWidgetData;

    if (!userWidgets || userWidgets.length < 1) return [];

    return userWidgets.map((widget: WidgetDto) => ({
      i: widget.id,
      x: widget.layout.x,
      y: widget.layout.y,
      w: WidgetDimensions[widget.size].w,
      h: WidgetDimensions[widget.size].h,
      type: widget.type,
      content: widget.content,
      static: !editMode,
      isResizable: false,
      isDraggable: editMode,
      redirectUrl: widget.redirectUrl,
      size: widget.size,
    }));
  }, [editMode, userWidgetData]);

  const handleLayoutChange = useCallback(
    (newLayout: WidgetLayoutItem[]) => {
      const updatedLayout = newLayout.map((layoutItem) => {
        const existingItem = layout.find((item) => item.i === layoutItem.i);
        return existingItem ? { ...existingItem, ...layoutItem } : layoutItem;
      });
      setLayout(updatedLayout);
    },
    [layout]
  );

  /** Triggered automatically when layout is changed, updates backend according to layout changes */
  const persistWidgetsLayoutOnChange = useCallback(
    (items?: WidgetLayoutItem[], key?: string) => {
      const itemsToUse = items && items.length > 0 ? items : layout;
      if (
        itemsToUse.length > 0 &&
        editMode &&
        currentBreakpoint != 'sm' &&
        currentBreakpoint != 'xs'
      ) {
        const payload: UpdateWidgetsBulkDto[] = itemsToUse.map((item) => {
          if (key && item.i === key) {
            return {
              id: item.i,
              layout: { h: item.h, w: item.w, x: item.x, y: item.y },
              size: item.size,
              content: { ...item.content, isCropped: false },
            };
          }
          return {
            id: item.i,
            layout: { h: item.h, w: item.w, x: item.x, y: item.y },
            size: item.size,
          };
        });
        updateWidgetsBulk(payload);
      }
    },
    [layout, editMode, currentBreakpoint, updateWidgetsBulk]
  );

  const handleWidgetDropStop = useCallback(
    (newLayout: Layout[]) => {
      const widgetLayoutItems: WidgetLayoutItem[] = newLayout.map((item) => {
        const layoutItem = layout.find((layoutItem) => layoutItem.i === item.i);
        return {
          ...item,
          type: layoutItem?.type,
          loading: layoutItem?.loading,
          content: layoutItem?.content,
          size: layoutItem?.size,
        } as WidgetLayoutItem;
      });
      persistWidgetsLayoutOnChange(widgetLayoutItems);
    },
    [layout, persistWidgetsLayoutOnChange]
  );

  const handleWidgetResize = useCallback(
    (key: string, w: number, h: number, widgetSize: WidgetSize) => {
      setLayout((prevLayout) => {
        let resetPhotoWidgetId = ''; // preserve id for resetting crop
        const newLayout = prevLayout.map((item) => {
          if (item.i === key) {
            if (
              item.type === 'Photo' &&
              (item.content as PhotoWidgetContentType).isCropped
            ) {
              resetPhotoWidgetId = item.i;
              const newContent = { ...item.content, isCropped: false };
              return { ...item, w, h, content: newContent, size: widgetSize };
            }
            return { ...item, w, h, size: widgetSize };
          }
          return item;
        });
        if (resetPhotoWidgetId) {
          persistWidgetsLayoutOnChange(newLayout, resetPhotoWidgetId);
        } else {
          persistWidgetsLayoutOnChange(newLayout);
        }
        return newLayout;
      });
    },
    [persistWidgetsLayoutOnChange]
  );

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
    const calculateBreakpoint = () => {
      const width = window.innerWidth;
      let breakpoint = currentBreakpoint;

      if (width < breakpoints.xxs) breakpoint = 'xxs'; // Added xxs breakpoint
      else if (width >= breakpoints.xxs && width < breakpoints.xs)
        breakpoint = 'xs';
      else if (width >= breakpoints.xs && width < breakpoints.sm)
        breakpoint = 'sm';
      else if (width >= breakpoints.sm && width < breakpoints.md)
        breakpoint = 'md';
      else if (width >= breakpoints.md && width < breakpoints.lg)
        breakpoint = 'lg';
      else if (width >= breakpoints.lg && width < breakpoints.xl)
        breakpoint = 'xl';

      console.log(breakpoint, currentBreakpoint, width);
      if (breakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(breakpoint);
      }
    };

    calculateBreakpoint();
    window.addEventListener('resize', calculateBreakpoint);
    return () => window.removeEventListener('resize', calculateBreakpoint);
  }, [currentBreakpoint]);

  useEffect(() => {
    let cols = 8;
    switch (currentBreakpoint) {
      case 'xxs':
        cols = 1;
        break;
      case 'xs':
        cols = 2;
        break;
      case 'sm':
        cols = 4;
        break;
      case 'md':
        cols = 4;
        break;
      case 'lg':
        cols = 5;
        break;
      default:
        setCols(8);
        setLayout(initialLayout);
        return;
    }
    setCols(cols);

    setLayout((prevLayout) => {
      let maxY = 0;
      return prevLayout.map((item) => {
        const { w, h } = getWidgetDimensions({
          breakpoint: currentBreakpoint,
          size: item.size as WidgetSize,
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

  return {
    layout,
    setLayout,
    handleLayoutChange,
    persistWidgetsLayoutOnChange,
    cols,
    animationStyles,
    widgetRefs,
    currentBreakpoint,
    handleWidgetDropStop,
    handleWidgetResize,
    isUserWidgetPending,
  };
};
