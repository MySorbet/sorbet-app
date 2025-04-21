import { delay, http, HttpResponse } from 'msw';

import { env } from '@/lib/env';

import { mockWidgets, sampleWidget } from './mock-widgets';
import { type CreateWidgetDto, UpdateWidgetDto } from './types';

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
    return HttpResponse.json(mockWidgets);
  }
);

/**
 * Mock the data from the `/v2/widgets/:id` PUT endpoint for updating widget properties
 */
export const mockUpdateWidgetHandler = http.put(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/v2/widgets/:id`,
  async ({ params, request }) => {
    const { id } = params;
    const previousWidget = mockWidgets.find((w) => w.id === id);
    if (!previousWidget) {
      return new HttpResponse(null, { status: 404 });
    }
    const updateData = (await request.json()) as UpdateWidgetDto;
    await delay();

    return HttpResponse.json({
      ...previousWidget,
      ...updateData,
      id: id as string,
      updatedAt: new Date(),
    });
  }
);

export const mockUpdateWidgetHandlerFailure = http.put(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/v2/widgets/:id`,
  async () => {
    await delay();
    return new HttpResponse(null, { status: 500 });
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

export const mockImageUploadHandler = http.post(
  `${env.NEXT_PUBLIC_SORBET_API_URL}/images/widgets`,
  async ({ request }) => {
    const formData = await request.formData();
    const _file = formData.get('file') as File;
    await delay();
    return HttpResponse.json({
      fileUrl: 'https://placehold.co/400/orange/white',
    });
  }
);
