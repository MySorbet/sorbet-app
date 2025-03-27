import { WidgetData } from '@/app/[handle]/components/widget/grid-config';

import { sampleLayoutLg, sampleLayoutSm } from './sample-layout';
import { ApiWidget } from './types';

export const mockWidgetData: Record<string, WidgetData> = {
  a: {
    id: 'a',
    title: 'Widget 1',
    contentUrl: 'https://picsum.photos/400/300?grayscale',
    href: 'https://picsum.photos/400/300?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
    userTitle: 'User Title 1',
  },
  b: {
    id: 'b',
    title: 'Widget 2',
    contentUrl: 'https://picsum.photos/300/400?grayscale',
    href: 'https://picsum.photos/300/400?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  c: {
    id: 'c',
    title: 'Widget 3',
    contentUrl: 'https://picsum.photos/350/350?grayscale',
    href: 'https://picsum.photos/350/350?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  d: {
    id: 'd',
    title: 'Widget 4',
    contentUrl: 'https://picsum.photos/450/300?grayscale',
    href: 'https://picsum.photos/450/300?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  e: {
    id: 'e',
    title: 'Widget 5',
    contentUrl: 'https://picsum.photos/500/250?grayscale',
    href: 'https://picsum.photos/500/250?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  f: {
    id: 'f',
    title: 'Widget 6',
    contentUrl: 'https://picsum.photos/400/400?grayscale',
    href: 'https://picsum.photos/400/400?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  g: {
    id: 'g',
    title: 'Widget 7',
    contentUrl: 'https://picsum.photos/600/600?grayscale',
    href: 'https://picsum.photos/600/600?grayscale',
    iconUrl: 'https://picsum.photos/32/32?grayscale',
  },
  h: {
    id: 'h',
    title: 'Widget 8',
    contentUrl: 'https://picsum.photos/550/550?grayscale',
    href: 'https://picsum.photos/550/550?grayscale',
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
      id: widget.id,
      href: widget.href ?? null,
      title: widget.title ?? null,
      userTitle: widget.userTitle ?? null,
      iconUrl: widget.iconUrl ?? null,
      contentUrl: widget.contentUrl ?? null,
      type: widget.type ?? null,
      custom: null,
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
