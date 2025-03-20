import { Layout } from 'react-grid-layout';

import { Breakpoint } from './grid-config';

export const sampleLayoutLg: Layout[] = [
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

export const sampleLayoutSm: Layout[] = [
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

export const sampleLayouts: Record<Breakpoint, Layout[]> = {
  lg: sampleLayoutLg,
  sm: sampleLayoutSm,
};
