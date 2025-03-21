import React, { createContext, useContext, useState } from 'react';
import { type Layout } from 'react-grid-layout';

import { type Breakpoint, type WidgetData } from './grid-config';
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
    const newWidget = {
      i: String.fromCharCode(65 + layouts[breakpoint].length),
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    };
    const newLayoutSm = [...layouts['sm'], newWidget];
    const newLayoutLg = [...layouts['lg'], newWidget];
    setLayouts({
      sm: newLayoutSm,
      lg: newLayoutLg,
    });
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
