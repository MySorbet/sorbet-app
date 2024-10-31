'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';

import { useAuth } from '@/hooks';
import { env } from '@/lib/env';

export function PHProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
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

/**
 * Wrapper used inside PostHogProvider that is meant to identify a user in PostHog.
 * We run an effect to check if there is a user, and if there is, identify that user with PostHog so that
 * we are able to run any PostHog functionality. If not, we are resetting PostHog to its default state.
 * Currently identifying by id, name, and email
 * @param param0
 * @returns
 */
const PostHogIdentityWrapper = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // TODO: Currently, PostHog is not capturing this id (the first arg) and is creating a UUID instead.
      posthog.identify(user.id, {
        email: user.email ?? '',
        name: `${user.firstName} ${user.lastName}`,
        // Adding this because the way we are creating users, PostHog is adding a UUID and not the id passed as the first arg
        sorbetId: user.id,
      });
    } else {
      console.log('terminating connection to PostHog...');
      posthog.reset();
    }
  }, [user]);

  const isRecording = posthog.sessionRecordingStarted();
  /**
   * This effect checks to see if a PostHog session recording is in progress.
   * If it is, we set a 1 minute timer to record and then stop the recording after.
   */
  useEffect(() => {
    if (isRecording) {
      console.log('session recording in progress...');
      const timer = setTimeout(() => {
        console.log('starting timer for session recording');
        posthog.stopSessionRecording();
        console.log('session recording ended');
      }, 60000); // * For how long the session recording lasts

      return () => {
        clearTimeout(timer)
        // This is a fallback in case for whatever reason, the session recording does not stop.
        posthog.stopSessionRecording()
      };
    } else {
      console.log('no session recording in progress');
    }
  }, [isRecording]);

  return children;
};
