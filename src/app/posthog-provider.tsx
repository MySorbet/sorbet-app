'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';

import { useAuth } from '@/hooks';
import { env } from '@/lib/env';

export function PHProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true, // Enable pageleave capture
      disable_session_recording: true, // Allows us to control which sessions we record (https://posthog.com/docs/session-replay/how-to-control-which-sessions-you-record)
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <PostHogIdentityWrapper>{children}</PostHogIdentityWrapper>
    </PostHogProvider>
  );
}

const PostHogIdentityWrapper = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user.email ?? '',
      });
    } else {
      posthog.reset();
    }
  }, [user]);

  return children;
};
