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

import {
  Breakpoint,
  breakpoints,
  cols,
  m,
  rh,
  w,
  wLg,
  wSm,
} from './grid-config';
import styles from './rgl-custom.module.css';
import { sampleLayouts } from './sample-layout';
const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * An RGL layout of widgets.
 *
 * A fixed row height drives the width, we calculate the width from a set rowheight for the grid
 */
export const WidgetGrid = () => {
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
        <ResponsiveGridLayout
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
        </ResponsiveGridLayout>
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
