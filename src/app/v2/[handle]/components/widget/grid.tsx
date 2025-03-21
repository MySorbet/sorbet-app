import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import React, { MutableRefObject, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { WidgetControls } from '@/app/v2/[handle]/components/widget/widget-controls';
import { cn } from '@/lib/utils';

import {
  Breakpoint,
  breakpoints,
  cols,
  getWidgetSizeFromDimensions as size,
  m,
  rh,
  w,
  WidgetSize,
  wLg,
  wSm,
} from './grid-config';
import styles from './rgl-custom.module.css';
import { useWidgets } from './use-widget-context';
import { Widget } from './widget';

// Wrap Responsive in WidthProvider to enable it to trigger breakpoint layouts according to it's parent's size
const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * An RGL layout of widgets.
 *
 * A fixed row height drives the width, we calculate the width from a set row height for the grid
 */
export const WidgetGrid = () => {
  const { widgets, layouts, breakpoint, setBreakpoint, onLayoutChange } =
    useWidgets();
  const width = w(breakpoint);

  const draggedRef = useRef<boolean>(false);

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
          onDragStart={() => (draggedRef.current = true)}
          onDragStop={() => (draggedRef.current = false)}
        >
          {layouts[breakpoint].map((layout) => {
            const widget = widgets[layout.i];
            const s = size(layout.w, layout.h);
            // TODO: Is it possible that you don't find a widget? and if so maybe throw and wrap with error boundary?
            return (
              <RGLHandle
                key={widget.id}
                className='group'
                size={s}
                id={widget.id}
                draggedRef={draggedRef}
              >
                <Widget
                  title={widget.title}
                  size={s}
                  contentUrl={widget.contentUrl}
                  href={widget.href}
                />
              </RGLHandle>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

interface RGLHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  debug?: boolean;
  draggedRef: MutableRefObject<boolean>;

  // 👇 these are a little bloated I feel, maybe this wrapper should be turned into two?
  size: WidgetSize;
  id: string;
}

// TODO: we are starting to overload this component. Its main purpose was to handle RGL related hacks so that the widget child could not worry too much. now it is rendering controls.
/**
 * This should be the direct child mapped inside RGL. We forward all necessary props this way.
 *
 * @see https://github.com/react-grid-layout/react-grid-layout?tab=readme-ov-file#custom-child-components-and-draggable-handles
 */
const RGLHandle = React.forwardRef<HTMLDivElement, RGLHandleProps>(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      debug = false,
      size,
      id,
      draggedRef,
      ...props
    },
    ref
  ) => {
    const { updateSize } = useWidgets();
    return (
      <div
        style={style}
        className={cn(
          'relative isolate',
          debug && 'border-divider rounded-2xl border-2 border-dashed',
          className
        )}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        // TODO: This just prevents a widget from being clicked when dropping. Fix this an make them clickable
        onClick={(e) => {
          console.log('clicked');
          e.preventDefault();
        }}
        {...props}
      >
        {children}
        {/* Controls */}
        <div
          className={cn(
            'z-1 absolute bottom-0 left-1/2 w-fit -translate-x-1/2 translate-y-1/2', // position
            'opacity-0 transition-opacity duration-300', // opacity
            !draggedRef.current && 'group-hover:opacity-100' // hover (only if not dragged)
            // TODO: How to prevent click from passing down to rgl
          )}
        >
          <WidgetControls
            size={size}
            onSizeChange={(size) => updateSize(id, size)}
          />
        </div>
      </div>
    );
  }
);

RGLHandle.displayName = 'WidgetRGLHandle';
