import { Layout } from 'react-grid-layout';

import { WidgetData } from '@/api/widgets-v2/types';
import { Breakpoint } from '@/app/[handle]/components/widget/grid-config';

const defaults: Omit<WidgetData, 'id'> = {
  contentUrl: null,
  userContentUrl: null,
  hideContent: false,
  href: null,
  iconUrl: null,
  title: null,
  userTitle: null,
  type: null,
  custom: null,
};

export const sampleWidgetsMap: Record<string, WidgetData> = {
  a: { ...defaults, id: 'a', title: 'Widget A' },
  b: { ...defaults, id: 'b', title: 'Widget B' },
  c: { ...defaults, id: 'c', title: 'Widget C' },
  d: { ...defaults, id: 'd', title: 'Widget D' },
  e: { ...defaults, id: 'e', title: 'Widget E' },
  f: { ...defaults, id: 'f', title: 'Widget F' },
  g: { ...defaults, id: 'g', title: 'Widget G' },
  h: { ...defaults, id: 'h', title: 'Widget H' },
  i: { ...defaults, id: 'i', title: 'Widget I' },
  j: { ...defaults, id: 'j', title: 'Widget J' },
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
  { i: 'i', x: 8, y: 4, w: 4, h: 1 }, // Size E
  { i: 'j', x: 0, y: 4, w: 4, h: 1 }, // Size E
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
  { i: 'i', x: 0, y: 16, w: 4, h: 1 }, // Size E
  { i: 'j', x: 0, y: 17, w: 4, h: 1 }, // Size E
];

export const sampleLayouts: Record<Breakpoint, Layout[]> = {
  lg: sampleLayoutLg,
  sm: sampleLayoutSm,
};
