import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';

import { useToast } from '@/components/ui/use-toast';
import {
  useCreateWidget,
  useDeleteWidget,
  useGetWidgetsForUser,
  useUpdateWidgetsBulk,
  useUploadWidgetsImage,
} from '@/hooks';
import {
  getWidgetDimensions,
  UpdateWidgetsBulkDto,
  WidgetDimensions,
  WidgetDto,
  WidgetLayoutItem,
  WidgetSize,
} from '@/types';

import { AddWidgets } from './add-widgets';
import { DesktopOnlyAlert } from './desktop-only-alert';
import {
  OnboardingDrawer,
  SocialHandleInputWidgetType,
  typeAndHandleToWidgetUrl,
} from './onboarding-drawer';
import styles from './react-grid-layout-custom.module.css';
import { parseWidgetTypeFromUrl } from './util';
import { Widget } from './widget';
import { WidgetPlaceholderGrid } from './widget-placeholder-grid';

const ReactGridLayout = WidthProvider(RGL);
const breakpoints = {
  xxs: 240,
  xs: 480,
  sm: 768,
  md: 996,
  lg: 1200,
  xl: 1600,
};

interface WidgetGridProps {
  rowHeight?: number;
  editMode: boolean;
  userId: string;
  onLayoutChange?: (layout: any) => void;
}

/**
 * Root component which renders all widgets and link input to add new widgets.
 */
export const WidgetGrid: React.FC<WidgetGridProps> = ({
  rowHeight = 120,
  editMode,
  userId,
  onLayoutChange,
}) => {
  const [layout, setLayout] = useState<WidgetLayoutItem[]>([]);
  const [initialLayout, setInitialLayout] = useState<WidgetLayoutItem[]>([]);
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
  const { mutateAsync: createWidget } = useCreateWidget();
  const { data: userWidgetData, isPending: isUserWidgetPending } =
    useGetWidgetsForUser(userId);

  // See this link to understand why we need to pass a ref boolean into draggable widgets
  // https://github.com/react-grid-layout/react-draggable/issues/531
  const draggedRef = useRef<boolean>(false);

  // State for the onboarding drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  /**
   * Handles the submission of the onboarding drawer.
   * Get an array of urls from the handles and call handleAddMultipleWidgets with them
   */
  const handleOnboardingDrawerSubmit = async (
    handles: Partial<Record<SocialHandleInputWidgetType, string>>
  ) => {
    const urls = Object.entries(handles).map(([type, handle]) => {
      return typeAndHandleToWidgetUrl(
        type as SocialHandleInputWidgetType,
        handle
      );
    });
    await handleAddMultipleWidgets(urls);
  };

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

  const handleWidgetAdd = async (url: string, image?: File) => {
    setAddingWidget(true);
    setError(null);
    let widgetUrl: string = url;

    try {
      const type = parseWidgetTypeFromUrl(url);

      // We're attempting to add a photo widget
      if (type === 'Photo' && image && image !== undefined) {
        const fileExtension = image.name.split('.').pop()?.toLowerCase();
        const imageFormData = new FormData();
        imageFormData.append('file', image);
        // fileType must be different for svgs to render correctly
        if (fileExtension == 'svg') {
          imageFormData.append('fileType', 'image/svg+xml');
        } else {
          imageFormData.append('fileType', 'image');
        }
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
      /**
       * Any function that is called by createWidget should throw a descriptive error upon failure using the RQ onError callback
       * i.e. if we are calling getInstagramProfileMetadata, it should throw a descriptive error that would bubble up to the onError callback
       */
      const widget = await createWidget({ url: widgetUrl, type });

      // TODO: createWidget probably should not return undefined
      if (!widget) {
        throw new Error('Failed to add widget. Please try again.');
      }

      // If you got the content, add the widget to the layout state and persist it in the database
      const widgetToAdd: WidgetLayoutItem = {
        i: widget.id,
        x: (layout.length * 2) % cols,
        y: 0,
        w: WidgetDimensions.A.w,
        h: WidgetDimensions.A.h,
        type: type,
        content: widget.content,
        static: !editMode,
        isResizable: false,
        isDraggable: editMode,
        loading: false,
        size: 'A',
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

  /**
   * Adds multiple widgets to the layout and database. This is a modified version of handleWidgetAdd above.
   * @param urls - An array of widget URLs to add.
   */
  const handleAddMultipleWidgets = async (urls: string[]) => {
    setAddingWidget(true);
    setError(null);

    const widgetsToAdd = (
      await Promise.all(
        urls.map(async (url, index) => {
          try {
            const type = parseWidgetTypeFromUrl(url);
            const widget = await createWidget({ url, type });

            // TODO: createWidget probably should not return undefined
            if (!widget) {
              throw new Error('Failed to add widget. Please try again.');
            }

            const widgetToAdd: WidgetLayoutItem = {
              i: widget.id,
              x: (index * 2) % cols,
              y: Math.floor((index * 2) / cols),
              w: WidgetDimensions.A.w,
              h: WidgetDimensions.A.h,
              type: type,
              content: widget.content,
              static: !editMode,
              isResizable: false,
              isDraggable: editMode,
              loading: false,
              size: 'A',
            };
            return widgetToAdd;
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Something went wrong';
            toast({
              title: `We couldn't add a widget`,
              description: message,
            });
          }
        })
      )
    ).filter((widget) => widget !== undefined);

    setLayout((prevLayout) => {
      const newLayout = [...prevLayout, ...widgetsToAdd];
      persistWidgetsLayoutOnChange(newLayout);
      return newLayout;
    });
    setInitialLayout((prevLayout) => [...prevLayout, ...widgetsToAdd]);
    setAddingWidget(false);
  };

  const handleLayoutChange = (newLayout: WidgetLayoutItem[]) => {
    const updatedLayout = newLayout.map((layoutItem) => {
      const existingItem = layout.find((item) => item.i === layoutItem.i);
      return existingItem ? { ...existingItem, ...layoutItem } : layoutItem;
    });

    setLayout(updatedLayout);
    onLayoutChange?.(updatedLayout);
  };

  const persistWidgetsLayoutOnChange = (items?: WidgetLayoutItem[]) => {
    const itemsToUse = items && items.length > 0 ? items : layout;
    if (itemsToUse.length > 0 && editMode) {
      const payload: UpdateWidgetsBulkDto[] = [];
      itemsToUse.map((item) =>
        payload.push({
          id: item.i,
          layout: { h: item.h, w: item.w, x: item.x, y: item.y },
          size: item.size,
        })
      );
      updateWidgetsBulk(payload);
    }
  };

  const handleWidgetDropStop = (newLayout: Layout[]) => {
    const widgetLayoutItems: WidgetLayoutItem[] = newLayout.map((item) => {
      const layoutItem = layout.find((layoutItem) => layoutItem.i === item.i);
      const newItem = {
        ...item,
        type: layoutItem?.type,
        loading: layoutItem?.loading,
        content: layoutItem?.content,
        size: layoutItem?.size,
      };
      return newItem as WidgetLayoutItem;
    });
    persistWidgetsLayoutOnChange(widgetLayoutItems);
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

  // Use the placeholder grid loading state while we fetch the user's widgets
  if (isUserWidgetPending) {
    return (
      <WidgetPlaceholderGrid
        loading
        className='px-[25px]' // Add some additional padding because RGL margin is around the entire grid
      />
    );
  }

  return (
    <>
      {editMode && layout.length < 1 && (
        <WidgetPlaceholderGrid
          onClick={() => setDrawerOpen(true)}
          loading={addingWidget}
          className='px-[25px]' // Add some additional padding because RGL margin is around the entire grid
        />
      )}
      <OnboardingDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleOnboardingDrawerSubmit}
      />
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
          onDrag={() => (draggedRef.current = true)}
        >
          {layout.map((item) => (
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
                showControls={editMode}
                handleResize={handleWidgetResize}
                handleRemove={handleWidgetRemove}
                content={item.content}
                initialSize={item.size}
                redirectUrl={item.redirectUrl}
                draggedRef={draggedRef}
              />
            </motion.div>
          ))}
        </ReactGridLayout>

        {editMode && (
          <div className='fix-modal-layout-shift fixed bottom-0 left-1/2 z-30 -translate-x-1/2 -translate-y-6 transform'>
            <AddWidgets addUrl={handleWidgetAdd} loading={addingWidget} />
          </div>
        )}
      </div>
    </>
  );
};
