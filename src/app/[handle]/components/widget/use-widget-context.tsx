import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import React, { createContext, useContext } from 'react';
import { type Layout } from 'react-grid-layout';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import {
  type ApiWidget,
  LayoutDto,
  UpdateWidgetDto,
  widgetsV2Api,
} from '@/api/widgets-v2';
import { uploadWidgetImage } from '@/api/widgets-v2/images';
import {
  DEFAULT_WIDGET_LAYOUT,
  useGridReducer,
} from '@/app/[handle]/components/widget/grid-reducer';
import { LayoutMap } from '@/app/[handle]/components/widget/grid-reducer';
import { WidgetMap } from '@/app/[handle]/components/widget/grid-reducer';

import { type Breakpoint, WidgetSize } from './grid-config';
import { useAbortMap } from './use-abort-map';
import { usePendingWidgets } from './use-pending-widgets';

interface WidgetContextType {
  /** Map of widget id to widget data */
  widgets: WidgetMap;
  /** Map of breakpoint to layout */
  layouts: LayoutMap;
  /** Current breakpoint */
  breakpoint: Breakpoint;
  /** Set the current breakpoint */
  setBreakpoint: (breakpoint: Breakpoint) => void;
  /** Handle a layout change */
  onLayoutChange: (layout: Layout[], allLayouts: LayoutMap) => void;
  /** Add a widget */
  addWidget: (url: string) => void;
  /** Update the size of a widget */
  updateSize: (id: string, size: WidgetSize) => void;
  /** Remove a widget */
  removeWidget: (id: string) => void;
  /** Add an image widget */
  addImage: (image: File) => void;
  /** Is fetching initial widgets */
  isLoading: boolean;
  /** Update a widget */
  updateWidget: (id: string, data: UpdateWidgetDto) => void;
}

const WidgetContext = createContext<WidgetContextType | null>(null);

/**
 * Provides state and operations for widgets in an RGL grid.
 */
export function WidgetProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  // The grid reducer manages grid state
  const [state, dispatch] = useGridReducer();

  // This is a little hack to keep track of the ids of widgets that have been added to UI, but we don't know if the API
  // has returned successfully. When layout changes happen, we choose not to update layouts for these widgets.
  // I wonder if we should just make these static until the call has completed? It shouldn't be too long.
  const { addPending, removePending, isPending } = usePendingWidgets();

  // We use this to abort image uploads when an image widget is delete while an upload is in progress
  const { addController, removeController, abortAndRemove } = useAbortMap();

  // Load initial widgets
  const { data: widgets, isLoading } = useQuery<ApiWidget[], Error>({
    queryKey: ['widgets', userId],
    queryFn: () => widgetsV2Api.getByUserId(userId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: (_, error) => !(isAxiosError(error) && error.status === 404),
  });

  // Transform and dispatch data when it arrives
  React.useEffect(() => {
    if (!widgets) return;
    dispatch({
      type: 'SET_INITIAL_WIDGETS',
      payload: fromApi(widgets),
    });
  }, [dispatch, widgets]);

  // Widget creation mutation
  const createWidgetMutation = useMutation({
    mutationFn: (params: { id: string; url: string }) =>
      widgetsV2Api.create({
        id: params.id,
        url: params.url,
        layouts: {
          sm: DEFAULT_WIDGET_LAYOUT,
          lg: DEFAULT_WIDGET_LAYOUT,
        },
      }),
    onMutate: ({ id, url }) => {
      // Track pending widget
      addPending(id);

      // Optimistic update
      dispatch({
        type: 'ADD_WIDGET',
        payload: { id, url },
      });
    },
    onSuccess: async ({ id, href }: ApiWidget) => {
      try {
        removePending(id);
        if (!href) {
          throw new Error('New widget has no href');
        }
        const enrichedWidget = await widgetsV2Api.enrich(id);
        dispatch({
          type: 'UPDATE_WIDGET',
          payload: { id, data: enrichedWidget },
        });
      } catch (error) {
        console.error('Failed to enrich widget:', error);
        // We failed, so this widget needs to stop loading and just be poor
        dispatch({
          type: 'UPDATE_WIDGET',
          payload: { id, data: {} },
        });
      }
    },
    onError: (error, { id }) => {
      console.error('Failed to create widget:', error);
      // Remove from pending and rollback
      removePending(id);
      dispatch({
        type: 'REMOVE_WIDGET',
        payload: { id },
      });
      toast.error("We couldn't add that link", {
        description: error.message,
      });
    },
  });

  const createImageWidgetMutation = useMutation({
    mutationFn: async (params: { id: string; image: File }) => {
      try {
        // First create the widget in the database (at this point, it is invalid since it has no contentUrl)
        const widget = await widgetsV2Api.create({
          id: params.id,
          type: 'image',
          layouts: {
            sm: DEFAULT_WIDGET_LAYOUT,
            lg: DEFAULT_WIDGET_LAYOUT,
          },
        });

        // Then upload the image with abort signal
        const abortController = addController(params.id);
        const contentUrl = await uploadWidgetImage(params.image, {
          signal: abortController.signal,
        });

        // Then update the widget with the image URL
        await widgetsV2Api.update(widget.id, {
          contentUrl,
        });

        return { ...widget, contentUrl };
      } catch (error) {
        // If the error is from an abort, we want to propagate it
        if (axios.isCancel(error)) {
          throw error;
        }
        throw error;
      } finally {
        removeController(params.id);
      }
    },

    onMutate: ({ id, image }) => {
      const tempUrl = URL.createObjectURL(image);
      addPending(id);
      dispatch({
        type: 'ADD_WIDGET',
        payload: { id, url: tempUrl, type: 'image' },
      });
      return { tempUrl };
    },

    onSuccess: async ({ id, contentUrl }, _, context) => {
      removePending(id);
      if (context?.tempUrl) {
        URL.revokeObjectURL(context.tempUrl);
      }
      dispatch({
        type: 'UPDATE_WIDGET',
        payload: {
          id,
          data: {
            contentUrl,
            type: 'image',
          },
        },
      });
    },

    onError: (error, { id }, context) => {
      // Don't show error toast if it was just aborted
      if (!axios.isCancel(error)) {
        console.error('Failed to create image widget:', error);
        toast.error("We couldn't add that image", {
          description: String(error),
        });
      }

      if (context?.tempUrl) {
        URL.revokeObjectURL(context.tempUrl);
      }

      removePending(id);
      dispatch({
        type: 'REMOVE_WIDGET',
        payload: { id },
      });
    },
  });

  // Layout update mutation
  const layoutMutation = useMutation({
    mutationFn: (updatedLayouts: LayoutDto[]) => {
      return widgetsV2Api.updateLayouts({
        layouts: updatedLayouts,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => widgetsV2Api.delete(id),
  });

  // TODO: Optimistic update and rollback on error
  const updateWidgetMutation = useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateWidgetDto }) =>
      widgetsV2Api.update(id, dto),
    onMutate: async ({ id, dto }) => {
      console.log('Mutating widget:', id, dto);
      // Store the previous widget data before the optimistic update
      const previousWidget = state.widgets[id];

      dispatch({
        type: 'UPDATE_WIDGET',
        payload: { id, data: dto },
      });

      // Return context with the previous widget data
      return { previousWidget };
    },
    onError: (error, { id }, context) => {
      console.error('Failed to update widget:', error);
      toast.error('Failed to update widget', {
        description: error.message,
      });

      // Rollback to previous state using the context
      if (context?.previousWidget) {
        console.log('Rolling back widget:', id, context.previousWidget);
        // Remove id from the object to avoid it being included in the rollback
        const { id: _id, ...previousState } = context.previousWidget;

        dispatch({
          type: 'UPDATE_WIDGET',
          payload: {
            id,
            data: previousState,
          },
        });
      }
    },
    onSuccess: async (data, { id }) => {
      console.log('Successfully updated widget:', id, data);
      // We don't need to do anything here since we already did the optimistic update
    },
  });

  const onLayoutChange = (_layout: Layout[], allLayouts: LayoutMap) => {
    // This function mainly handles drag and drop changes -- position.
    // When size or breakpoint changes, it is called AFTER state has been updated
    // So we don't really care about those events. We could optimize this with a equality check before updating
    // if (hasLayoutMapChanged(allLayouts, state.layouts, state.breakpoint)) {

    dispatch({
      type: 'UPDATE_LAYOUTS',
      payload: { layouts: allLayouts },
    });

    // Filter out pending widgets and convert to API format
    const layoutsToUpdate = [
      ...toApiLayouts(
        allLayouts.sm.filter((layout) => !isPending(layout.i)),
        'sm'
      ),
      ...toApiLayouts(
        allLayouts.lg.filter((layout) => !isPending(layout.i)),
        'lg'
      ),
    ];
    if (layoutsToUpdate.length > 0) {
      layoutMutation.mutate(layoutsToUpdate);
    }
  };

  const addWidget = (url: string) => {
    const id = uuidv4();
    createWidgetMutation.mutate({ id, url });
    // mutation handles complex dispatching logic
  };

  const addImage = (image: File) => {
    const id = uuidv4();
    createImageWidgetMutation.mutate({ id, image });
  };

  const removeWidget = (id: string) => {
    abortAndRemove(id); // Abort any ongoing upload
    dispatch({ type: 'REMOVE_WIDGET', payload: { id } });
    deleteMutation.mutate(id);
  };

  const updateSize = (id: string, size: WidgetSize) => {
    dispatch({
      type: 'UPDATE_WIDGET_SIZE',
      payload: { id, size },
    });
    // Network sync is handled in onLayoutChange
  };

  const setBreakpoint = (breakpoint: Breakpoint) => {
    dispatch({
      type: 'SET_BREAKPOINT',
      payload: { breakpoint },
    });
  };

  const updateWidget = (id: string, data: UpdateWidgetDto) => {
    // Fire and forget an update. errors and rollbacks are handled in the mutation
    updateWidgetMutation.mutate({ id, dto: data });
  };

  return (
    <WidgetContext.Provider
      value={{
        widgets: state.widgets,
        layouts: state.layouts,
        breakpoint: state.breakpoint,
        setBreakpoint,
        onLayoutChange,
        addWidget,
        addImage,
        updateSize,
        removeWidget,
        updateWidget,
        isLoading,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
}

/** Hook to access widget state and operations */
export function useWidgets(): WidgetContextType {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgets must be used within a WidgetProvider');
  }
  return context;
}
/**
 * Transform API widgets into the format needed by our app
 * Widgets come as an array with a layout for each breakpoint
 * We transform this into a map of widgets by id and a map of layouts by breakpoint (as the WidgetReducer expects)
 */
function fromApi(apiWidgets: ApiWidget[]): {
  widgets: WidgetMap;
  layouts: LayoutMap;
} {
  const widgetMap: WidgetMap = {};
  const layoutMap: LayoutMap = { sm: [], lg: [] };

  apiWidgets.forEach((widget) => {
    // Transform the widgets to a map by id
    widgetMap[widget.id] = widget;

    // Bisect the layouts into a map by breakpoint
    widget.layouts.forEach((layout) => {
      layoutMap[layout.breakpoint].push({
        i: widget.id,
        x: layout.x,
        y: layout.y,
        w: layout.w,
        h: layout.h,
      });
    });
  });

  return { widgets: widgetMap, layouts: layoutMap };
}

/**
 * Transform an array of layouts into the API format
 *
 * - Transforms `i` -> `id`
 * - Adds the `breakpoint` to each layout item
 */
function toApiLayouts(layouts: Layout[], breakpoint: Breakpoint): LayoutDto[] {
  return layouts.map((layout) => ({
    id: layout.i,
    breakpoint,
    x: layout.x,
    y: layout.y,
    w: layout.w,
    h: layout.h,
  }));
}
