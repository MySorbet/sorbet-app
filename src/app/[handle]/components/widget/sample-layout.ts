import { Layout } from 'react-grid-layout';

import { Breakpoint, WidgetData } from './grid-config';

export const sampleWidgetsMap: Record<string, WidgetData> = {
  a: { id: 'a', title: 'Widget A' },
  b: { id: 'b', title: 'Widget B' },
  c: { id: 'c', title: 'Widget C' },
  d: { id: 'd', title: 'Widget D' },
  e: { id: 'e', title: 'Widget E' },
  f: { id: 'f', title: 'Widget F' },
  g: { id: 'g', title: 'Widget G' },
  h: { id: 'h', title: 'Widget H' },
  // i: { id: 'i', title: 'Widget I' },
};

export const sampleLayoutLg: Layout[] = [
  { i: 'a', x: 0, y: 0, w: 2, h: 2 }, // Size B
  { i: 'b', x: 2, y: 0, w: 2, h: 2 }, // Size B
  { i: 'c', x: 4, y: 0, w: 2, h: 2 }, // Size B
  { i: 'd', x: 6, y: 0, w: 2, h: 2 }, // Size B

  { i: 'e', x: 0, y: 2, w: 4, h: 2 }, // Size D
  { i: 'f', x: 4, y: 2, w: 4, h: 2 }, // Size D

  { i: 'g', x: 0, y: 4, w: 4, h: 4 }, // Size A
  { i: 'h', x: 4, y: 4, w: 4, h: 4 }, // Size A
  // { i: 'i', x: 8, y: 4, w: 4, h: 1 }, // Size E
];

export const sampleLayoutSm: Layout[] = [
  { i: 'a', x: 0, y: 0, w: 2, h: 2 }, // Size B
  { i: 'b', x: 2, y: 0, w: 2, h: 2 }, // Size B

  { i: 'c', x: 0, y: 2, w: 2, h: 2 }, // Size B
  { i: 'd', x: 2, y: 2, w: 2, h: 2 }, // Size B

  { i: 'e', x: 0, y: 4, w: 4, h: 2 }, // Size D
  { i: 'f', x: 0, y: 6, w: 4, h: 2 }, // Size D

  { i: 'g', x: 0, y: 8, w: 4, h: 4 }, // Size A
  { i: 'h', x: 0, y: 12, w: 4, h: 4 }, // Size A
  // { i: 'i', x: 0, y: 16, w: 4, h: 1 }, // Size E
];

export const sampleLayouts: Record<Breakpoint, Layout[]> = {
  lg: sampleLayoutLg,
  sm: sampleLayoutSm,
};
