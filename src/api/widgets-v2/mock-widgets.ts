import { WidgetData } from '@/api/widgets-v2/types';

import { sampleLayoutLg, sampleLayoutSm } from './sample-layout';
import { ApiWidget } from './types';

const defaults: Omit<WidgetData, 'id'> = {
  title: null,
  userTitle: null,
  iconUrl: null,
  type: null,
  custom: null,
  contentUrl: null,
  userContentUrl: null,
  hideContent: false,
  href: null,
};

export const mockWidgetData: Record<string, WidgetData> = {
  a: {
    ...defaults,
    id: 'a',
    title: 'Widget 1',
    contentUrl: 'https://picsum.photos/400/300?grayscale',
    href: 'https://picsum.photos/400/300?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
    userTitle: 'User Title 1',
  },
  b: {
    ...defaults,
    id: 'b',
    title: 'Widget 2',
    contentUrl: 'https://picsum.photos/300/400?grayscale',
    href: 'https://picsum.photos/300/400?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
    userTitle: null,
    type: null,
    custom: null,
  },
  c: {
    ...defaults,
    id: 'c',
    title: 'Widget 3',
    contentUrl: 'https://picsum.photos/350/350?grayscale',
    href: 'https://picsum.photos/350/350?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  d: {
    ...defaults,
    id: 'd',
    contentUrl: 'https://picsum.photos/450/300?grayscale',
    href: 'https://picsum.photos/450/300?grayscale',
    type: 'image',
  },
  e: {
    ...defaults,
    id: 'e',
    title: 'Widget 5',
    contentUrl: 'https://picsum.photos/500/250?grayscale',
    userContentUrl: 'https://picsum.photos/500/250',
    href: 'https://picsum.photos/500/250?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  f: {
    ...defaults,
    id: 'f',
    contentUrl: 'https://picsum.photos/400/400?grayscale',
    type: 'image',
  },
  g: {
    ...defaults,
    id: 'g',
    title: 'Widget 7',
    contentUrl: 'https://picsum.photos/600/600?grayscale',
    href: 'https://picsum.photos/600/600?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  h: {
    ...defaults,
    id: 'h',
    title: 'Widget 8',
    href: 'https://picsum.photos/550/550?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  i: {
    ...defaults,
    id: 'i',
    title: 'Widget 9',
    contentUrl: 'https://picsum.photos/600/600?grayscale',
    href: 'https://picsum.photos/600/600?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  j: {
    ...defaults,
    id: 'j',
    title: 'Widget 10',
    contentUrl: 'https://picsum.photos/600/600?grayscale',
    href: 'https://picsum.photos/600/600?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
};

export const sampleWidget: ApiWidget = {
  id: '123',
  title: 'Sample Widget',
  userTitle: 'Sample User Title',
  iconUrl: 'https://placehold.co/32/orange/white',
  contentUrl: 'https://placehold.co/400/orange/white',
  userContentUrl: null,
  hideContent: false,
  href: 'https://example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '1',
  layouts: [
    { id: '123', x: 0, y: 0, w: 2, h: 2, breakpoint: 'sm' },
    { id: '123', x: 0, y: 0, w: 4, h: 4, breakpoint: 'lg' },
  ],
  type: null,
  custom: null,
};

export const mockWidgets: ApiWidget[] = Object.values(mockWidgetData).map(
  (widget) => {
    // Find corresponding layouts for this widget
    const smLayout = sampleLayoutSm.find((l) => l.i === widget.id);
    const lgLayout = sampleLayoutLg.find((l) => l.i === widget.id);

    return {
      ...widget,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: '1',
      layouts: [
        smLayout
          ? {
              id: widget.id,
              x: smLayout.x,
              y: smLayout.y,
              w: smLayout.w,
              h: smLayout.h,
              breakpoint: 'sm',
            }
          : { id: widget.id, x: 0, y: 0, w: 1, h: 1, breakpoint: 'sm' },
        lgLayout
          ? {
              id: widget.id,
              x: lgLayout.x,
              y: lgLayout.y,
              w: lgLayout.w,
              h: lgLayout.h,
              breakpoint: 'lg',
            }
          : { id: widget.id, x: 0, y: 0, w: 1, h: 1, breakpoint: 'lg' },
      ],
    };
  }
);
