import { WidgetData } from '@/api/widgets-v2/types';

import { sampleLayoutLg, sampleLayoutSm } from './sample-layout';
import { ApiWidget } from './types';

const nulls: Omit<WidgetData, 'id'> = {
  title: null,
  userTitle: null,
  iconUrl: null,
  type: null,
  custom: null,
  contentUrl: null,
  href: null,
};

export const mockWidgetData: Record<string, WidgetData> = {
  a: {
    ...nulls,
    id: 'a',
    title: 'Widget 1',
    contentUrl: 'https://picsum.photos/400/300?grayscale',
    href: 'https://picsum.photos/400/300?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
    userTitle: 'User Title 1',
  },
  b: {
    ...nulls,
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
    ...nulls,
    id: 'c',
    title: 'Widget 3',
    contentUrl: 'https://picsum.photos/350/350?grayscale',
    href: 'https://picsum.photos/350/350?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  d: {
    ...nulls,
    id: 'd',
    contentUrl: 'https://picsum.photos/450/300?grayscale',
    href: 'https://picsum.photos/450/300?grayscale',
    type: 'image',
  },
  e: {
    ...nulls,
    id: 'e',
    title: 'Widget 5',
    contentUrl: 'https://picsum.photos/500/250?grayscale',
    href: 'https://picsum.photos/500/250?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  f: {
    ...nulls,
    id: 'f',
    contentUrl: 'https://picsum.photos/400/400?grayscale',
    type: 'image',
  },
  g: {
    ...nulls,
    id: 'g',
    title: 'Widget 7',
    contentUrl: 'https://picsum.photos/600/600?grayscale',
    href: 'https://picsum.photos/600/600?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  h: {
    ...nulls,
    id: 'h',
    title: 'Widget 8',
    contentUrl: 'https://picsum.photos/550/550?grayscale',
    href: 'https://picsum.photos/550/550?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  i: {
    ...nulls,
    id: 'i',
    title: 'Widget 9',
    contentUrl: 'https://picsum.photos/600/600?grayscale',
    href: 'https://picsum.photos/600/600?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  j: {
    ...nulls,
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
