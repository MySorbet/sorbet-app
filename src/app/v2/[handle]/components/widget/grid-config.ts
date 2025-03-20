export type Breakpoint = 'sm' | 'lg';

// The five supported sizes for widgets and a map describing the number of rows and cols for each size
export type WidgetSize = 'A' | 'B' | 'C' | 'D' | 'E';
export const LayoutSizes: Record<WidgetSize, { w: number; h: number }> = {
  A: { w: 4, h: 4 },
  B: { w: 2, h: 2 },
  C: { w: 2, h: 4 },
  D: { w: 4, h: 2 },
  E: { w: 4, h: 1 },
} as const;

export const cols: Record<Breakpoint, number> = {
  lg: 8,
  sm: 4,
};

export const rh = 68; // row height
export const m = 40; // margin

/** Calculate the width if the grid given the above row height and margin, and the number of columns (which depends on the breakpoint) */
export const w = (breakpoint: Breakpoint) => {
  const numCols = cols[breakpoint];
  return rh * numCols + m * (numCols + 1);
};

// Precalculate the grid widths for the breakpoints
export const wSm = w('sm');
export const wLg = w('lg');

// These are the breakpoints the grid will use to decide when to change the number of columns
// So just go one smaller than the value of its controlling container
export const breakpoints: Record<Breakpoint, number> = {
  lg: wLg - 1,
  sm: wSm - 1,
};
