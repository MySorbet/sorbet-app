import { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from 'react-grid-layout';
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
  WidgetLayoutItem,
  WidgetDto,
  WidgetDimensions,
  WidgetSize,
} from '@/types';
import { parseWidgetTypeFromUrl } from '@/components/profile/widgets/util';
import {
  SocialHandleInputWidgetType,
  typeAndHandleToWidgetUrl,
} from '@/components/profile/widgets/onboarding-drawer';
import { WidgetGridProps } from '@/components/profile/widgets/widget-grid';

const breakpoints = {
  xxs: 240,
  xs: 480,
  sm: 768,
  md: 996,
  lg: 1200,
  xl: 1600,
};

export const useWidgetGrid = ({
  userId,
  editMode,
  onLayoutChange,
}: WidgetGridProps) => {
  const [layout, setLayout] = useState<WidgetLayoutItem[]>([]);
  const [initialLayout, setInitialLayout] = useState<WidgetLayoutItem[]>([]);
  const [addingWidget, setAddingWidget] = useState<boolean>(false);
  const [cols, setCols] = useState<number>(8);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const widgetRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const [animationStyles, setAnimationStyles] = useState<{
    [key: string]: { width: number; height: number };
  }>({});
  const [errorInvalidImage, setErrorInvalidImage] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const draggedRef = useRef<boolean>(false);

  const { toast } = useToast();

  const { mutateAsync: uploadWidgetsImageAsync } = useUploadWidgetsImage();
  const { mutateAsync: updateWidgetsBulk } = useUpdateWidgetsBulk();
  const { mutateAsync: deleteWidget } = useDeleteWidget();
  const { mutateAsync: createWidget } = useCreateWidget();
  const { data: userWidgetData, isPending: isUserWidgetPending } =
    useGetWidgetsForUser(userId);

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
    let widgetUrl: string = url;

    try {
      const type = parseWidgetTypeFromUrl(url);

      if (type === 'Photo' && image && image !== undefined) {
        const imageFormData = new FormData();
        imageFormData.append('file', image);
        imageFormData.append('fileType', 'image');
        imageFormData.append('destination', 'widgets');
        imageFormData.append('userId', '');
        const response = await uploadWidgetsImageAsync(imageFormData);
        if (response.data && response.data.fileUrl) {
          widgetUrl = response.data.fileUrl;
        } else {
          throw new Error('Widget image not uploaded');
        }
      }

      const widget = await createWidget({ url: widgetUrl, type });

      if (!widget) {
        throw new Error('Failed to add widget. Please try again.');
      }

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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      toast({
        title: `We couldn't add a widget`,
        description: message,
      });
    } finally {
      setAddingWidget(false);
    }
  };

  const handleFileDrop = async (file: File) => {
    const validExtensions = ['jpg', 'jpeg', 'png', 'svg', 'gif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileSize = file.size / 1024 / 1024; // in MB

    if (
      !fileExtension ||
      !validExtensions.includes(fileExtension) ||
      fileSize > 10
    ) {
      setErrorInvalidImage(true);
      return;
    }

    setAddingWidget(true);
    try {
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      imageFormData.append('fileType', 'image');
      imageFormData.append('destination', 'widgets');
      imageFormData.append('userId', userId);

      const response = await uploadWidgetsImageAsync(imageFormData);
      if (response.data && response.data.fileUrl) {
        await handleWidgetAdd(response.data.fileUrl, file);
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      setErrorInvalidImage(true);
    } finally {
      setAddingWidget(false);
    }
  };

  const handleAddMultipleWidgets = async (urls: string[]) => {
    setAddingWidget(true);

    const widgetsToAdd = (
      await Promise.all(
        urls.map(async (url, index) => {
          try {
            const type = parseWidgetTypeFromUrl(url);
            const widget = await createWidget({ url, type });

            if (!widget) {
              throw new Error('Failed to add widget. Please try again.');
            }

            return {
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
            } as WidgetLayoutItem;
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
    ).filter((widget): widget is WidgetLayoutItem => widget !== undefined);

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
      const payload: UpdateWidgetsBulkDto[] = itemsToUse.map((item) => ({
        id: item.i,
        layout: { h: item.h, w: item.w, x: item.x, y: item.y },
        size: item.size,
      }));
      updateWidgetsBulk(payload);
    }
  };

  const handleWidgetDropStop = (newLayout: Layout[]) => {
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
  }, []);

  return {
    layout,
    cols,
    containerRef,
    widgetRefs,
    animationStyles,
    errorInvalidImage,
    setErrorInvalidImage,
    addingWidget,
    drawerOpen,
    setDrawerOpen,
    handleLayoutChange,
    handleWidgetResize,
    handleOnboardingDrawerSubmit,
    handleWidgetRemove,
    handleWidgetAdd,
    handleFileDrop,
    handleAddMultipleWidgets,
    handleWidgetDropStop,
    draggedRef,
    isUserWidgetPending,
  };
};
