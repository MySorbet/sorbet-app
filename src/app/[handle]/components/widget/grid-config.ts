export type Breakpoint = 'sm' | 'lg';

// The five supported sizes for widgets and a map describing the number of rows and cols for each size
export const WidgetSizes = ['A', 'B', 'C', 'D', 'E'] as const;
export type WidgetSize = (typeof WidgetSizes)[number];
export const LayoutSizes: Record<WidgetSize, { w: number; h: number }> = {
  A: { w: 4, h: 4 },
  B: { w: 2, h: 2 },
  C: { w: 2, h: 4 },
  D: { w: 4, h: 2 },
  E: { w: 4, h: 1 },
} as const;

/**
 * Build a map of widget size keys as` wxh` to widget size values driven by the LayoutSizes object above
 *
 * Looks like:
 * ```
 * {
 *  '4x4': 'A',
 *  '2x2': 'B',
 *  '2x4': 'C',
 *  '4x2': 'D',
 *  '4x1': 'E',
 * }
 * ```
 */
const dimensionToSize: Record<string, WidgetSize> = Object.entries(
  LayoutSizes
).reduce(
  (acc, [size, { w, h }]) => ({
    ...acc,
    [`${w}x${h}`]: size,
  }),
  {}
);

/**
 * Helper to look up widget size from dimensions in O(1) time
 * We use this to drive the widget size from the layout.
 * It's important to understand that WidgetSize is a display concept that tells a widget how to render its contents. It is not stored or persisted, but driven by the layout.
 * It can be different between layouts.
 */
export const getWidgetSizeFromDimensions = (
  w: number,
  h: number
): WidgetSize => {
  const size = dimensionToSize[`${w}x${h}`];
  if (!size) throw new Error(`Widget size not found for dimensions ${w}x${h}`);
  return size;
};

// 👇 This is size config and calculations for the grid.

export const cols: Record<Breakpoint, number> = {
  lg: 8,
  sm: 4,
};

/**
 * 40px margins for lg breakpoint
 * 20px for sm breakpoint
 */
export const margins: Record<Breakpoint, [number, number]> = {
  lg: [40, 40],
  sm: [20, 20],
};

/**
 * This number drives calculations for the rest of the grid.
 * We say that widgets will be 68px tall, and  everything else is calculated to be square.
 */
export const rowHeight = 68;

/**
 * Calculate the width if the grid given the above row height and margin, and the number of columns (which depends on the breakpoint)
 */
export const gw = (breakpoint: Breakpoint) => {
  const numCols = cols[breakpoint];
  const margin = margins[breakpoint][0];
  return rowHeight * numCols + margin * (numCols + 1);
};

// Precalculate the grid widths for the breakpoints
export const wSm = gw('sm');
export const wLg = gw('lg');

// These are the breakpoints the grid will use to decide when to change the number of columns
// So just go one smaller than the value of its controlling container
export const breakpoints: Record<Breakpoint, number> = {
  lg: wLg - 1,
  sm: wSm - 1,
};
