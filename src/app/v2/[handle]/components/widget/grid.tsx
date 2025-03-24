import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import React, { MutableRefObject, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import {
  Breakpoint,
  breakpoints,
  cols,
  getWidgetSizeFromDimensions as size,
  gw,
  margins,
  rowHeight,
  WidgetSize,
  wLg,
  wSm,
} from './grid-config';
import styles from './rgl-custom.module.css';
import { useHandlePaste } from './use-handle-paste';
import { useWidgets } from './use-widget-context';
import { Widget } from './widget';
import { WidgetControls } from './widget-controls';
import { WidgetDeleteButton } from './widget-delete-button';

// Wrap Responsive in WidthProvider to enable it to trigger breakpoint layouts according to it's parent's size
const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * An RGL layout of widgets.
 *
 * A fixed row height drives the entire grid width to maintain square cells.
 * This component will fill the width and height of its parent container -- usually, this will be most of the screen.
 * When grid content grows taller than this height, this component will render a virtual scrollbar to allow the user to scroll through the grid.
 * It will also break between a sm and lg size, based on it's own width using a container query.
 */
export const WidgetGrid = ({ immutable = false }: { immutable?: boolean }) => {
  const {
    widgets,
    layouts,
    breakpoint,
    setBreakpoint,
    onLayoutChange,
    addWidget,
  } = useWidgets();
  const width = gw(breakpoint);

  const draggedRef = useRef<boolean>(false);

  useHandlePaste(addWidget);

  return (
    <ScrollArea className='@container size-full'>
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
          rowHeight={rowHeight}
          margin={margins}
          width={width}
          isResizable={false}
          isDraggable={!immutable}
          onBreakpointChange={(b: Breakpoint) => setBreakpoint(b)}
          onLayoutChange={onLayoutChange}
          onDragStart={() => (draggedRef.current = true)}
          onDragStop={() => (draggedRef.current = false)}
        >
          {layouts[breakpoint].map((layout) => {
            const widget = widgets[layout.i];

            // It's possible for a bag to happen where the layout has an id that is not in the widgets map
            // It would be better to be more explicit here and throw, but this provides a nicer experience and seems to cause no issues.
            if (!widget) {
              // throw new Error(`Widget with id ${layout.i} not found`);
              console.error(`Widget with id ${layout.i} not found`);
              return null;
            }
            const s = size(layout.w, layout.h);
            return (
              <RGLHandle
                key={widget.id}
                size={s}
                id={widget.id}
                draggedRef={draggedRef}
                hideControls={immutable}
              >
                <Widget {...widget} size={s} />
              </RGLHandle>
            );
          })}
        </ResponsiveGridLayout>
      </div>
    </ScrollArea>
  );
};

interface RGLHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  debug?: boolean;
  draggedRef: MutableRefObject<boolean>;

  // 👇 these are a little bloated I feel, maybe this wrapper should be turned into two?
  size: WidgetSize;
  id: string;
  hideControls?: boolean;
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
      hideControls = false,
      ...props
    },
    ref
  ) => {
    const { updateSize, removeWidget } = useWidgets();
    return (
      <div
        style={style}
        className={cn(
          'group relative isolate',
          debug && 'border-divider rounded-2xl border-2 border-dashed',
          className
        )}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
        // TODO: This just prevents a widget from being clicked when dropping. Fix this an make them clickable
        onClick={(e) => {
          e.preventDefault();
        }}
        {...props}
      >
        {children}
        {/* Controls */}
        {/* within containers to prevent clicks from being passed down to RGL, hover to show correctly, and position absolutely*/}
        {!hideControls && (
          <>
            <div
              className={cn(
                'absolute bottom-0 left-1/2 w-fit -translate-x-1/2 translate-y-1/2', // position
                'opacity-0 transition-opacity duration-300', // opacity
                !draggedRef.current && 'group-hover:opacity-100' // hover (only if not dragged)
              )}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <WidgetControls
                size={size}
                onSizeChange={(size) => updateSize(id, size)}
              />
            </div>
            <div
              className={cn(
                'absolute right-0 top-0 -translate-y-1/3 translate-x-1/3', // position
                'opacity-0 transition-opacity duration-300', // opacity
                !draggedRef.current && 'group-hover:opacity-100' // hover (only if not dragged)
              )}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <WidgetDeleteButton onDelete={() => removeWidget(id)} />
            </div>
          </>
        )}
      </div>
    );
  }
);

RGLHandle.displayName = 'WidgetRGLHandle';
