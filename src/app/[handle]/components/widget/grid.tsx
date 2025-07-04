import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import React, { useEffect, useState } from 'react';
import { Responsive } from 'react-grid-layout';
const RRGL = Responsive as unknown as React.ComponentType<any>;

import { WidgetData } from '@/api/widgets-v2/types';
import { useContainerQuery } from '@/hooks/use-container-query';
import { cn } from '@/lib/utils';

import {
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
import { useWidgets } from './use-widget-context';
import { Widget } from './widget';
import { Control, ImageControls } from './widget-controls/control-config';
import { WidgetControls } from './widget-controls/widget-controls';
import { WidgetDeleteButton } from './widget-controls/widget-delete-button';

/**
 * An RGL layout of widgets.
 *
 * A fixed row height drives the entire grid width to maintain square cells.
 * This component will fill the width of its parent container -- usually, this will be most of the screen. It's height will grow to fit the grid.
 * It will also break between a sm and lg size, based on it's own width using a container query.
 */
export const WidgetGrid = ({ immutable = false }: { immutable?: boolean }) => {
  const {
    widgets,
    layouts,
    breakpoint,
    setBreakpoint,
    onLayoutChange,
    updateWidget,
  } = useWidgets();

  const width = gw(breakpoint);

  // Part of a little trick to allow both clicking and dragging on rgl children
  const [dragging, setDragging] = useState(false);

  // This trick puts us in control of the breakpoint via a container query rather than
  // setting up a width listener on the grid and relying on that to trigger onBreakpointChange
  // Note: this should also line up with `wLg` from `grid-config.ts`
  const { ref, matches } = useContainerQuery<HTMLDivElement>('56rem');
  useEffect(() => setBreakpoint(matches ? 'lg' : 'sm'), [matches]);

  return (
    <div className='@container w-full'>
      {/* This div responds to its parents size, going between a sm and lg size, which then triggers the grid breakpoint. centers the grid inside using mx-auto */}
      <div
        className='@4xl:w-[var(--wlg)] mx-auto w-[var(--wsm)]'
        ref={ref}
        style={
          {
            '--wsm': `${wSm}px`,
            '--wlg': `${wLg}px`,
          } as React.CSSProperties
        }
      >
        <RRGL
          compactType='vertical'
          className={styles['rgl-custom']}
          layouts={layouts}
          cols={cols}
          rowHeight={rowHeight}
          margin={margins}
          width={width}
          isResizable={false}
          isDraggable={!immutable}
          breakpoints={breakpoints}
          breakpoint={breakpoint}
          onLayoutChange={onLayoutChange}
          onDrag={() => setDragging(true)}
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
              <RGLNode
                key={widget.id}
                dragging={dragging}
                setDragging={setDragging}
                className='group/widget'
              >
                <Widget
                  {...widget}
                  size={s}
                  dragging={dragging}
                  editable={!immutable}
                  showPlaceholder={!immutable}
                  onUpdate={(data) => updateWidget(widget.id, data)}
                />
                {!immutable && (
                  <ControlOverlay
                    widget={widget}
                    size={s}
                    dragging={dragging}
                    controls={
                      widget.type === 'image' ? ImageControls : undefined
                    }
                  />
                )}
              </RGLNode>
            );
          })}
        </RRGL>
      </div>
    </div>
  );
};

/**
 * This should be the direct child mapped inside RGL. This component:
 * 1. Forwards a ref to the underlying DOM node
 * 2. Forwards `style`, `className` (through cn), `onMouseDown`, `onMouseUp` and `onTouchEnd` to that same DOM node.
 * 3. Adds some special sauce to prevent clicks from being triggered when dragging.
 *
 * @see https://github.com/react-grid-layout/react-grid-layout?tab=readme-ov-file#custom-child-components-and-draggable-handles
 */
const RGLNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
    debug?: boolean;
    dragging: boolean;
    setDragging: (dragging: boolean) => void;
  }
>(
  (
    { className, children, debug = false, dragging, setDragging, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          debug && 'border-divider rounded-2xl border-2 border-dashed',
          className
        )}
        onClick={(e) => {
          dragging && e.preventDefault();
          setDragging(false);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

RGLNode.displayName = 'RGLNode';

/**
 * Render widget controls and a delete button over a widget
 *
 * Should be rendered in a container that is the size of the widget, with `group/widget` and `relative` classes
 */
const ControlOverlay = ({
  widget,
  size,
  dragging,
  controls,
}: {
  widget: WidgetData;
  size: WidgetSize;
  dragging: boolean;
  controls?: Control[];
}) => {
  const { updateSize, removeWidget, updateWidget } = useWidgets();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { id, href } = widget;

  // Containers implement hover behavior and position absolutely
  return (
    <>
      <div
        className={cn(
          'absolute bottom-0 left-1/2 w-fit -translate-x-1/2 translate-y-1/2', // position
          'opacity-0 transition-opacity duration-300 ease-out', // opacity
          !dragging && 'group-hover/widget:opacity-100', // hover (only if not dragged)
          isPopoverOpen && 'opacity-100' // show when popover is open
        )}
      >
        <WidgetControls
          size={size}
          onSizeChange={(size) => updateSize(id, size)}
          href={href}
          controls={controls}
          onAddLink={(link) => updateWidget(id, { href: link })}
          isPopoverOpen={isPopoverOpen}
          setIsPopoverOpen={setIsPopoverOpen}
        />
      </div>
      <div
        className={cn(
          'absolute right-0 top-0 -translate-y-1/3 translate-x-1/3', // position
          'opacity-0 transition-opacity duration-300 ease-out', // opacity
          !dragging && 'group-hover/widget:opacity-100', // hover (only if not dragged)
          isPopoverOpen && 'opacity-100' // show when popover is open
        )}
      >
        <WidgetDeleteButton onDelete={() => removeWidget(id)} />
      </div>
    </>
  );
};
