import { delay, http, HttpResponse } from 'msw';

import { mockUser } from '@/api/user/mock-user';
import { env } from '@/lib/env';
import { User } from '@/types';

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
    return HttpResponse.json<User>({
      ...mockUser,
      handle: handle as string,
    });
  }
);
