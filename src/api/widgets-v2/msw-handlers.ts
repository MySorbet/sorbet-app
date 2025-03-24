import { delay, http, HttpResponse } from 'msw';

import { env } from '@/lib/env';

import {
  type ApiWidget,
  type CreateWidgetDto,
  type UpdateWidgetV2Dto,
} from './types';

// 👇 These handlers were AI generated and have not been tested or used yet

const sampleWidget: ApiWidget = {
  id: '123',
  title: 'Sample Widget',
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
};

/**
 * Mock the data from the `/v2/widgets` POST endpoint for creating widgets
 */
export const mockCreateWidgetHandler = http.post(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/v2/widgets`,
  async ({ request }) => {
    const data = (await request.json()) as CreateWidgetDto;
    await delay();
    return HttpResponse.json({
      ...sampleWidget,
      id: data.id,
      layouts: [
        { id: data.id, ...data.layouts.sm, breakpoint: 'sm' },
        { id: data.id, ...data.layouts.lg, breakpoint: 'lg' },
      ],
    });
  }
);

/**
 * Mock the data from the `/v2/widgets/layouts` PUT endpoint for updating layouts
 */
export const mockUpdateLayoutsHandler = http.put(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/v2/widgets/layouts`,
  async () => {
    await delay();
    return new HttpResponse(null, { status: 200 });
  }
);

/**
 * Mock the data from the `/v2/widgets/:id` DELETE endpoint
 */
export const mockDeleteWidgetHandler = http.delete(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/v2/widgets/:id`,
  async () => {
    await delay();
    return new HttpResponse(null, { status: 200 });
  }
);

/**
 * Mock the data from the `/v2/widgets` GET endpoint with query params
 */
export const mockGetWidgetsHandler = http.get(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/v2/widgets`,
  async () => {
    await delay();
    return HttpResponse.json([sampleWidget]);
  }
);

/**
 * Mock the data from the `/v2/widgets/:id` PUT endpoint for updating widget properties
 */
export const mockUpdateWidgetHandler = http.put(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/v2/widgets/:id`,
  async ({ params, request }) => {
    const { id } = params;
    const updateData = (await request.json()) as UpdateWidgetV2Dto;
    await delay();

    return HttpResponse.json({
      ...sampleWidget,
      id: id as string,
      title: updateData.title,
      contentUrl: updateData.contentUrl,
      custom: updateData.custom,
      updatedAt: new Date(),
    });
  }
);

/**
 * Mock the data from the `/v2/widgets/:id/enrich` POST endpoint
 */
export const mockEnrichWidgetHandler = http.post(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/v2/widgets/:id/enrich`,
  async ({ params }) => {
    const { id } = params;
    await delay();

    return HttpResponse.json({
      ...sampleWidget,
      id: id as string,
      title: 'Enriched Title',
      iconUrl: 'https://placehold.co/32/orange/white',
      contentUrl: 'https://placehold.co/400/orange/white',
      href: 'https://example.com',
      updatedAt: new Date(),
    });
  }
);
