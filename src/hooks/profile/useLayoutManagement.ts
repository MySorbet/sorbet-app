import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from 'react-grid-layout';
import { useGetWidgetsForUser, useUpdateWidgetsBulk } from '@/hooks';
import {
  WidgetLayoutItem,
  UpdateWidgetsBulkDto,
  WidgetDto,
  WidgetDimensions,
  WidgetSize,
  getWidgetDimensions,
} from '@/types';
import { WidgetGridProps } from '@/components/profile/widgets/widget-grid';

const breakpoints = {
  xxs: 240,
  xs: 480,
  sm: 768,
  md: 996,
  lg: 1200,
  xl: 1600,
};

export const useLayoutManagement = ({
  userId,
  editMode,
  onLayoutChange,
}: WidgetGridProps) => {
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
  }, [userId, editMode, userWidgetData]);

  const handleLayoutChange = useCallback(
    (newLayout: WidgetLayoutItem[]) => {
      const updatedLayout = newLayout.map((layoutItem) => {
        const existingItem = layout.find((item) => item.i === layoutItem.i);
        return existingItem ? { ...existingItem, ...layoutItem } : layoutItem;
      });

      setLayout(updatedLayout);
      onLayoutChange?.(updatedLayout);
    },
    [layout, onLayoutChange]
  );

  const persistWidgetsLayoutOnChange = useCallback(
    (items?: WidgetLayoutItem[]) => {
      const itemsToUse = items && items.length > 0 ? items : layout;
      if (itemsToUse.length > 0 && editMode) {
        const payload: UpdateWidgetsBulkDto[] = itemsToUse.map((item) => ({
          id: item.i,
          layout: { h: item.h, w: item.w, x: item.x, y: item.y },
          size: item.size,
        }));
        console.log(payload);
        updateWidgetsBulk(payload);
      }
    },
    [layout, editMode, updateWidgetsBulk]
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
        const newLayout = prevLayout.map((item) => {
          if (item.i === key) {
            return { ...item, w, h, size: widgetSize };
          }
          return item;
        });
        persistWidgetsLayoutOnChange(newLayout);
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
  }, [currentBreakpoint]);

  useEffect(() => {
    let cols = 8;
    switch (currentBreakpoint) {
      case 'xxs':
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
    cols,
    animationStyles,
    widgetRefs,
    handleLayoutChange,
    handleWidgetDropStop,
    handleWidgetResize,
    isUserWidgetPending,
    persistWidgetsLayoutOnChange,
  };
};
