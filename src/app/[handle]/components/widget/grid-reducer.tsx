import { useReducer } from 'react';
import { type Layout } from 'react-grid-layout';

import { UpdateWidgetDto, WidgetData, WidgetType } from '@/api/widgets-v2';

import { type Breakpoint, LayoutSizes, WidgetSize } from './grid-config';

// Types for state
type LoadableWidget = WidgetData & {
  loading?: boolean;
  previewLoading?: boolean; // Specifically indicates a preview loading from an update (not initial load)
};
export type WidgetMap = Record<string, LoadableWidget>;
export type LayoutMap = Record<Breakpoint, Layout[]>;

// Payloads
type AddWidgetPayload = { id: string; url: string; type?: WidgetType };
type UpdateWidgetPayload = {
  id: string;
  data: UpdateWidgetDto & { previewLoading?: boolean };
};
type RemoveWidgetPayload = { id: string };
type UpdateLayoutsPayload = { layouts: LayoutMap };
type UpdateWidgetSizePayload = { id: string; size: WidgetSize };
type SetBreakpointPayload = { breakpoint: Breakpoint };
type SetInitialWidgetsPayload = { widgets: WidgetMap; layouts: LayoutMap };

// Actions
type GridAction =
  | { type: 'ADD_WIDGET'; payload: AddWidgetPayload }
  | { type: 'UPDATE_WIDGET'; payload: UpdateWidgetPayload }
  | { type: 'REMOVE_WIDGET'; payload: RemoveWidgetPayload }
  | { type: 'UPDATE_LAYOUTS'; payload: UpdateLayoutsPayload }
  | { type: 'UPDATE_WIDGET_SIZE'; payload: UpdateWidgetSizePayload }
  | { type: 'SET_BREAKPOINT'; payload: SetBreakpointPayload }
  | { type: 'SET_INITIAL_WIDGETS'; payload: SetInitialWidgetsPayload };

// State
type GridState = {
  widgets: WidgetMap;
  layouts: LayoutMap;
  breakpoint: Breakpoint;
};

/**
 * The default layout for a new widget.
 * All widgets start at 0,0 in a small square size (B).
 */
export const DEFAULT_WIDGET_LAYOUT = {
  x: 0,
  y: 0,
  ...LayoutSizes['B'],
};

/** Use a reducer to manage the state of the grid */
function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    /**
     * Here, we add the widget to the layout right away in a loading state
     * This is so that we can show a loading state in the UI immediately
     * This will update both layout data and widget data
     */
    case 'ADD_WIDGET': {
      const { id } = action.payload;
      const type = action.payload.type ?? null; // type is optional so explicitly set to null
      const href = type === 'image' ? null : action.payload.url; // url is the href for non-image widget creation
      const contentUrl = type === 'image' ? action.payload.url : null; // if this is an image widget creation, the url is contentUrl
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [id]: {
            id,
            href,
            contentUrl,
            type,
            title: null,
            userTitle: null,
            iconUrl: null,
            custom: null,
            hideContent: false,
            userContentUrl: null,
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
     * This will set loading to false
     */
    case 'UPDATE_WIDGET': {
      const { id, data } = action.payload;
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [id]: {
            ...state.widgets[id],
            loading: false,
            ...data,
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
 * A grid reducer which manages the state of an RGL grid storing widgets and their layouts.
 *
 * You can use this for fast optimistic updates, and build a network layer on top of it.
 */
export const useGridReducer = () =>
  useReducer(gridReducer, {
    widgets: {},
    layouts: { sm: [], lg: [] },
    breakpoint: 'lg',
  });
