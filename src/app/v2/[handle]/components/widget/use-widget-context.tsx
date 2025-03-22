import React, { createContext, useContext, useReducer } from 'react';
import { type Layout } from 'react-grid-layout';
import { parseURL } from 'ufo';
import { v4 as uuidv4 } from 'uuid';

import {
  type Breakpoint,
  type WidgetData,
  LayoutSizes,
  WidgetSize,
} from './grid-config';
import { sampleLayouts, sampleWidgetsMap } from './sample-layout';

// Types for widget data
type LoadableWidget = WidgetData & { loading?: boolean };
type WidgetMap = Record<string, LoadableWidget>;
type LayoutMap = Record<Breakpoint, Layout[]>;

// Action payloads
type AddWidgetStartPayload = { id: string; url: string };
type AddWidgetCompletePayload = { id: string; data: WidgetData };
type RemoveWidgetPayload = { id: string };
type UpdateLayoutsPayload = { layouts: LayoutMap };
type UpdateWidgetSizePayload = { id: string; size: WidgetSize };
type SetBreakpointPayload = { breakpoint: Breakpoint };

// Actions
type WidgetAction =
  | { type: 'ADD_WIDGET_START'; payload: AddWidgetStartPayload }
  | { type: 'ADD_WIDGET_COMPLETE'; payload: AddWidgetCompletePayload }
  | { type: 'REMOVE_WIDGET'; payload: RemoveWidgetPayload }
  | { type: 'UPDATE_LAYOUTS'; payload: UpdateLayoutsPayload }
  | { type: 'UPDATE_WIDGET_SIZE'; payload: UpdateWidgetSizePayload }
  | { type: 'SET_BREAKPOINT'; payload: SetBreakpointPayload };

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
}

const WidgetContext = createContext<WidgetContextType | null>(null);

// Mock API - we'll replace this later
const mockApi = {
  async fetchWidgetData(id: string, url: string): Promise<WidgetData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      id,
      title: `Widget for ${url}`,
      iconUrl: 'https://placehold.co/32/orange/white',
      contentUrl: 'https://placehold.co/400/orange/white',
    };
  },
};

function widgetReducer(state: WidgetState, action: WidgetAction): WidgetState {
  switch (action.type) {
    /**
     * Here, we add the widget to the layout right away in a loading state
     * This is so that we can show a loading state in the UI immediately
     * This will update both layout data and widget data
     */
    case 'ADD_WIDGET_START': {
      const { id, url } = action.payload;
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [id]: {
            id,
            title: parseURL(url).host || url,
            loading: true,
          },
        },
        // Add widget with default size to both breakpoints
        layouts: {
          sm: [{ i: id, ...LayoutSizes['B'], x: 0, y: 0 }, ...state.layouts.sm],
          lg: [{ i: id, ...LayoutSizes['B'], x: 0, y: 0 }, ...state.layouts.lg],
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
      const newLayouts = {
        sm: updateLayoutSize(state.layouts.sm, id, LayoutSizes[size]),
        lg: updateLayoutSize(state.layouts.lg, id, LayoutSizes[size]),
      };
      return {
        ...state,
        layouts: newLayouts,
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
export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(widgetReducer, {
    widgets: sampleWidgetsMap,
    layouts: sampleLayouts,
    breakpoint: 'lg',
  });

  const addWidget = async (url: string) => {
    const id = uuidv4();

    // Dispatch immediate update for optimistic UI
    dispatch({
      type: 'ADD_WIDGET_START',
      payload: { id, url },
    });

    try {
      // Simulate API call
      const data = await mockApi.fetchWidgetData(id, url);

      dispatch({
        type: 'ADD_WIDGET_COMPLETE',
        payload: { id, data },
      });
    } catch (error) {
      // For now, just log the error
      console.error('Failed to load widget data:', error);
    }
  };

  const removeWidget = (id: string) => {
    dispatch({ type: 'REMOVE_WIDGET', payload: { id } });
  };

  const onLayoutChange = (_layout: Layout[], allLayouts: LayoutMap) => {
    dispatch({
      type: 'UPDATE_LAYOUTS',
      payload: { layouts: allLayouts },
    });
  };

  const updateSize = (id: string, size: WidgetSize) => {
    dispatch({
      type: 'UPDATE_WIDGET_SIZE',
      payload: { id, size },
    });
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
        updateSize,
        removeWidget,
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
