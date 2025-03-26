import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import React, { createContext, useContext, useReducer } from 'react';
import { type Layout } from 'react-grid-layout';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import {
  type ApiWidget,
  LayoutDto,
  widgetsV2Api,
  WidgetType,
} from '@/api/widgets-v2';
import { uploadWidgetImage } from '@/api/widgets-v2/images';

import {
  type Breakpoint,
  type WidgetData,
  LayoutSizes,
  WidgetSize,
} from './grid-config';
import { useAbortMap } from './use-abort-map';
import { usePendingWidgets } from './use-pending-widgets';

// Types for widget data
type LoadableWidget = WidgetData & { loading?: boolean };
type WidgetMap = Record<string, LoadableWidget>;
type LayoutMap = Record<Breakpoint, Layout[]>;

// Action payloads
type AddWidgetStartPayload = { id: string; url: string; type?: WidgetType };
type AddWidgetCompletePayload = { id: string; data: Omit<WidgetData, 'id'> };
type RemoveWidgetPayload = { id: string };
type UpdateLayoutsPayload = { layouts: LayoutMap };
type UpdateWidgetSizePayload = { id: string; size: WidgetSize };
type SetBreakpointPayload = { breakpoint: Breakpoint };
type SetInitialWidgetsPayload = { widgets: WidgetMap; layouts: LayoutMap };

// Actions
type WidgetAction =
  | { type: 'ADD_WIDGET_START'; payload: AddWidgetStartPayload }
  | { type: 'ADD_WIDGET_COMPLETE'; payload: AddWidgetCompletePayload }
  | { type: 'REMOVE_WIDGET'; payload: RemoveWidgetPayload }
  | { type: 'UPDATE_LAYOUTS'; payload: UpdateLayoutsPayload }
  | { type: 'UPDATE_WIDGET_SIZE'; payload: UpdateWidgetSizePayload }
  | { type: 'SET_BREAKPOINT'; payload: SetBreakpointPayload }
  | { type: 'SET_INITIAL_WIDGETS'; payload: SetInitialWidgetsPayload };

// State
type WidgetState = {
  widgets: WidgetMap;
  layouts: LayoutMap;
  breakpoint: Breakpoint;
};

// Context type
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
}

const WidgetContext = createContext<WidgetContextType | null>(null);

const DEFAULT_WIDGET_LAYOUT = {
  x: 0,
  y: 0,
  ...LayoutSizes['B'],
};

function widgetReducer(state: WidgetState, action: WidgetAction): WidgetState {
  switch (action.type) {
    /**
     * Here, we add the widget to the layout right away in a loading state
     * This is so that we can show a loading state in the UI immediately
     * This will update both layout data and widget data
     */
    case 'ADD_WIDGET_START': {
      const { id, url, type } = action.payload;
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [id]: {
            id,
            href: type === 'image' ? undefined : url,
            contentUrl: type === 'image' ? url : undefined,
            type,
            loading: true,
          },
        },
        // Add widget with default size to both breakpoints
        layouts: {
          sm: [{ i: id, ...DEFAULT_WIDGET_LAYOUT }, ...state.layouts.sm],
          lg: [{ i: id, ...DEFAULT_WIDGET_LAYOUT }, ...state.layouts.lg],
        },
      };
    }

    /**
     * Here, we update the widget data with the actual data from the API
     * This will update only the widget data
     */
    case 'ADD_WIDGET_COMPLETE': {
      const { id, data } = action.payload;
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [id]: {
            ...state.widgets[id],
            ...data,
            loading: false,
          },
        },
      };
    }

    /**
     * Here, we remove the widget from the layout
     * This will update both layout data and widget data
     */
    case 'REMOVE_WIDGET': {
      const { id } = action.payload;
      const { [id]: _, ...remainingWidgets } = state.widgets;
      return {
        ...state,
        widgets: remainingWidgets,
        layouts: {
          sm: state.layouts.sm.filter((item) => item.i !== id),
          lg: state.layouts.lg.filter((item) => item.i !== id),
        },
      };
    }

    /**
     * Here, we just replace all layouts with the new ones (usually reported by rgl)
     * This will update only the layout data
     */
    case 'UPDATE_LAYOUTS': {
      return {
        ...state,
        layouts: action.payload.layouts,
      };
    }

    /**
     * Here, we update the size of a widget
     * This will update only the layout data
     */
    case 'UPDATE_WIDGET_SIZE': {
      const { id, size } = action.payload;
      return {
        ...state,
        layouts: {
          ...state.layouts,
          [state.breakpoint]: updateLayoutSize(
            state.layouts[state.breakpoint],
            id,
            LayoutSizes[size]
          ),
        },
      };
    }

    /**
     * Here, we update the current breakpoint
     * We just need to maintain this state for RGL (and since we base some calculations on it)
     */
    case 'SET_BREAKPOINT': {
      return {
        ...state,
        breakpoint: action.payload.breakpoint,
      };
    }

    /**
     * Here, we update the initial widgets
     * This will update both layout data and widget data
     */
    case 'SET_INITIAL_WIDGETS': {
      const { widgets, layouts } = action.payload;
      return {
        ...state,
        widgets,
        layouts,
      };
    }
  }
}

// Helper function for updating layout sizes
function updateLayoutSize(
  layouts: Layout[],
  id: string,
  size: { w: number; h: number }
): Layout[] {
  return layouts.map((item) => (item.i === id ? { ...item, ...size } : item));
}

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
  // The widget reducer manages grid state
  const [state, dispatch] = useReducer(widgetReducer, {
    widgets: {},
    layouts: { sm: [], lg: [] },
    breakpoint: 'lg',
  });

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
  }, [widgets]);

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
        type: 'ADD_WIDGET_START',
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
          type: 'ADD_WIDGET_COMPLETE',
          payload: { id, data: enrichedWidget },
        });
      } catch (error) {
        console.error('Failed to enrich widget:', error);
        // We failed, so this widget needs to stop loading and just be poor
        dispatch({
          type: 'ADD_WIDGET_COMPLETE',
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
        type: 'ADD_WIDGET_START',
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
        type: 'ADD_WIDGET_COMPLETE',
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
      ...toApi(
        allLayouts.sm.filter((layout) => !isPending(layout.i)),
        'sm'
      ),
      ...toApi(
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
 * Transform our layout format into the API format
 *
 * Transforms i -> id and adds the breakpoint to each layout item
 */
function toApi(layouts: Layout[], breakpoint: Breakpoint): LayoutDto[] {
  return layouts.map((layout) => ({
    id: layout.i,
    breakpoint: breakpoint,
    x: layout.x,
    y: layout.y,
    w: layout.w,
    h: layout.h,
  }));
}
