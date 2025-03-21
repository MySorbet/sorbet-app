import React, { createContext, useContext, useState } from 'react';
import { type Layout } from 'react-grid-layout';

import {
  type Breakpoint,
  type WidgetData,
  LayoutSizes,
  WidgetSize,
} from './grid-config';
import { sampleLayouts, sampleWidgetsMap } from './sample-layout';

interface WidgetContextType {
  /** Map of widget id to widget data */
  widgets: Record<string, WidgetData>;
  /** Map of breakpoint to layout */
  layouts: Record<Breakpoint, Layout[]>;
  /** Current breakpoint */
  breakpoint: Breakpoint;
  /** Set the current breakpoint */
  setBreakpoint: (breakpoint: Breakpoint) => void;
  /** Handle a layout change */
  onLayoutChange: (
    layout: Layout[],
    allLayouts: Record<Breakpoint, Layout[]>
  ) => void;
  /** Add a widget */
  addWidget: () => void;
  /** Update the size of a widget */
  updateSize: (id: string, size: WidgetSize) => void;
}

const WidgetContext = createContext<WidgetContextType | null>(null);

/** Provider component for widget state management */
export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const [widgets, setWidgets] =
    useState<Record<string, WidgetData>>(sampleWidgetsMap);
  const [layouts, setLayouts] =
    useState<Record<Breakpoint, Layout[]>>(sampleLayouts);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  const onLayoutChange = (
    layout: Layout[],
    allLayouts: Record<Breakpoint, Layout[]>
  ) => {
    setLayouts(allLayouts);
  };

  const addWidget = () => {
    const newWidgetLayout = {
      i: String.fromCharCode(65 + Object.keys(widgets).length),
      ...LayoutSizes['B'], // Default size is the small one
      // Default position is top left, but maybe we could do something more interesting (find the highest open 2x2 spot)
      x: 0,
      y: 0,
    };

    // Batch these to make them atomic
    // TODO: Instead, use a reducer
    setTimeout(() => {
      setWidgets({
        ...widgets,
        [newWidgetLayout.i]: {
          id: newWidgetLayout.i,
          title: 'New Widget',
        },
      });
      setLayouts({
        sm: [newWidgetLayout, ...layouts['sm']],
        lg: [newWidgetLayout, ...layouts['lg']],
      });
    }, 0);
  };

  const updateSize = (id: string, size: WidgetSize) => {
    // For the layout corresponding to the current breakpoint,
    // update the size of the widget with id `id` to the size specified in `size`
    const newLayout = updateLayout(layouts[breakpoint], id, {
      ...LayoutSizes[size],
    });
    setLayouts({ ...layouts, [breakpoint]: newLayout });
  };

  return (
    <WidgetContext.Provider
      value={{
        widgets,
        layouts,
        breakpoint,
        setBreakpoint,
        onLayoutChange,
        addWidget,
        updateSize,
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

// Helper to find an element `elementId` in `layout` and update it with the properties from `newLayout`
const updateLayout = (
  layout: Layout[],
  elementId: string,
  newLayout: Omit<Partial<Layout>, 'i'>
) => {
  return layout.map((item) => {
    if (item.i === elementId) {
      return { ...item, ...newLayout };
    }
    return item;
  });
};
