import { delay, http, HttpResponse } from 'msw';

import { mockUserPublic } from '@/api/user/mock-user';
import { env } from '@/lib/env';
import { UserPublic } from '@/types';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

// TODO: IS there a more MSW/typesafe to grab handle?
/**
 * Mock the data from the `/users/handle/:handle` endpoint
 */
export const mockUserByHandleHandler = http.get(
  `${API_URL}/users/handle/*`,
  async ({ params }) => {
    const { handle } = params;
    await delay();
    return HttpResponse.json<UserPublic>({
      ...mockUserPublic,
      handle: handle as string,
    });
  }
);

export const mockUserByHandleHandlerFailure = http.get(
  `${API_URL}/users/handle/*`,
  async () => {
    await delay();
    return new HttpResponse(null, {
      status: 404,
    });
  }
);

export const mockContactMeHandler = http.post(
  `${API_URL}/users/contact/*`,
  async () => {
    await delay();
    return HttpResponse.json({
      success: true,
    });
  }
);
