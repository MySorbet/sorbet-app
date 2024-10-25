import { PostHog } from 'posthog-node';

import { env } from '@/lib/env';

/**
 * This is for running PostHog in server components.
 * Note that we are limited to what we can do in comparison to using it on the client.
 * * cmd+click the return type to see the methods available
 */
export default function PostHogServerClient(): PostHog {
  const posthogClient = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: env.NEXT_PUBLIC_POSTHOG_HOST,
    // flushAt sets how many capture calls we should flush the queue (in one batch).
    flushAt: 1,
    // flushInterval sets how many milliseconds we should wait before flushing the queue.
    // Setting them to the lowest number ensures events are sent immediately and not batched.
    //We also need to call await posthog.shutdown() once done.
    flushInterval: 0,
  });

  return posthogClient;
}
