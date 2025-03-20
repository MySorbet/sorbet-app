// import { Widget } from './widget';

export type WidgetCustomData = {
  contentUrl?: string;
  href?: string;
  iconUrl?: string;
  id: string;
  title: string;
  size: 'A' | 'B' | 'C' | 'D';
  loading?: boolean;
};

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import React, { useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';

import { cn } from '@/lib/utils';

import styles from './rgl-custom.module.css';

const GridLayoutWithWidth = WidthProvider(Responsive);

type Breakpoint = 'sm' | 'lg';

type WidgetSize = 'A' | 'B' | 'C' | 'D' | 'E';
const LayoutSizes: Record<WidgetSize, { w: number; h: number }> = {
  A: { w: 4, h: 4 },
  B: { w: 2, h: 2 },
  C: { w: 2, h: 4 },
  D: { w: 4, h: 2 },
  E: { w: 4, h: 1 },
} as const;

const initialLayoutLG = [
  { i: 'a', x: 0, y: 0, w: 2, h: 2 },
  { i: 'b', x: 2, y: 0, w: 2, h: 2 },
  { i: 'c', x: 4, y: 0, w: 2, h: 2 },
  { i: 'd', x: 6, y: 0, w: 2, h: 2 },

  { i: 'e', x: 0, y: 2, w: 4, h: 2 },
  { i: 'f', x: 4, y: 2, w: 4, h: 2 },

  { i: 'g', x: 0, y: 4, w: 4, h: 4 },
  { i: 'h', x: 4, y: 4, w: 4, h: 4 },
  { i: 'i', x: 8, y: 4, w: 4, h: 1 },
];

const initialLayoutSM = [
  { i: 'a', x: 0, y: 0, w: 2, h: 2 },
  { i: 'b', x: 2, y: 0, w: 2, h: 2 },

  { i: 'c', x: 0, y: 2, w: 2, h: 2 },
  { i: 'd', x: 2, y: 2, w: 2, h: 2 },

  { i: 'e', x: 0, y: 4, w: 4, h: 2 },
  { i: 'f', x: 0, y: 6, w: 4, h: 2 },

  { i: 'g', x: 0, y: 8, w: 4, h: 4 },
  { i: 'h', x: 0, y: 12, w: 4, h: 4 },
  { i: 'i', x: 0, y: 16, w: 4, h: 1 },
];

const initialLayout: Record<Breakpoint, Layout[]> = {
  lg: initialLayoutLG,
  sm: initialLayoutSM,
};

const cols: Record<Breakpoint, number> = {
  lg: 8,
  sm: 4,
};

const rh = 68; // row height
const m = 40; // margin

/** Calculate the width if the grid given the above row height and margin, and the number of columns (which depends on the breakpoint) */
const w = (breakpoint: Breakpoint) => {
  const numCols = cols[breakpoint];
  return rh * numCols + m * (numCols + 1);
};

// Precalculate the grid widths for the breakpoints
const wSm = w('sm');
const wLg = w('lg');

// These are the breakpoints the grid will use to decide when to change the number of columns
// So just go one smaller than the value of its controlling container
const breakpoints: Record<Breakpoint, number> = {
  lg: wLg - 1,
  sm: wSm - 1,
};

/**
 * An RGL layout of widgets.
 *
 * A fixed row height drives the width, we calculate the width from a set rowheight for the grid
 */
export const WidgetGrid = () => {
  const [layouts, setLayouts] =
    useState<Record<Breakpoint, Layout[]>>(initialLayout);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  const onLayoutChange = (
    layout: Layout[],
    allLayouts: Record<Breakpoint, Layout[]>
  ) => {
    setLayouts(allLayouts);
  };

  const addWidget = () => {
    // Find the layout for the current breakpoint
    const newWidget = {
      i: String.fromCharCode(65 + layouts[breakpoint].length),
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    };
    // Add a new widget to the layouts
    const newLayoutSm = [...layouts['sm'], newWidget];
    const newLayoutLg = [...layouts['lg'], newWidget];
    // Update the layouts state with the new layouts
    setLayouts({
      sm: newLayoutSm,
      lg: newLayoutLg,
    });
  };

  const width = w(breakpoint);

  return (
    <div className='@container size-full overflow-y-auto'>
      {/* This div responds to its parents size, going between a sm and lg size, which then triggers the grid breakpoint. centers the grid inside using mx-auto */}
      <div
        className='@4xl:w-[var(--wlg)] mx-auto w-[var(--wsm)]'
        style={
          {
            '--wsm': `${wSm}px`,
            '--wlg': `${wLg}px`,
          } as React.CSSProperties
        }
      >
        <GridLayoutWithWidth
          compactType='vertical'
          className={styles['rgl-custom']}
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={rh}
          margin={[m, m]}
          width={width}
          isResizable={false}
          onBreakpointChange={(b: Breakpoint) => setBreakpoint(b)}
          onLayoutChange={onLayoutChange}
        >
          {layouts[breakpoint].map((item) => (
            <WidgetRGLHandle key={item.i}></WidgetRGLHandle>
          ))}
        </GridLayoutWithWidth>
      </div>
    </div>
  );
};

interface WidgetRGLHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * This should be the direct child mapped inside RGL. We forward all necessary props this way.
 *
 * @see https://github.com/react-grid-layout/react-grid-layout?tab=readme-ov-file#custom-child-components-and-draggable-handles
 */
const WidgetRGLHandle = React.forwardRef<HTMLDivElement, WidgetRGLHandleProps>(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        style={style}
        className={cn(
          'border-divider rounded-2xl border-2 border-dashed',
          className
        )}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);

WidgetRGLHandle.displayName = 'WidgetRGLHandle';

// Helper to find an element `elementId` in `layout` and update it with the properties from `newLayout`
const updateElementInLayout = (
  layout: Layout[],
  elementId: string,
  newLayout: Partial<Layout>
) => {
  return layout.map((item) => {
    if (item.i === elementId) {
      return { ...item, ...newLayout };
    }
    return item;
  });
};
