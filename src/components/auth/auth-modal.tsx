'use client';

import {
  useCreateWallet,
  useLoginWithEmail,
  usePrivy,
} from '@privy-io/react-auth';
import { useCreateWallet as useCreateExtendedChainWallet } from '@privy-io/react-auth/extended-chains';
import { useQueryState } from 'nuqs';
import posthog from 'posthog-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { checkAccess, getAccessConfig, getMe, signup } from '@/api/auth';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/hooks';
import { featureFlags } from '@/lib/flags';

import { AuthModalEmail } from './auth-modal-email';
import { AuthModalOtp } from './auth-modal-otp';
import { AuthModalWaitlist } from './auth-modal-waitlist';
import { AuthModalMode, useAuthModalState } from './use-auth-modal-state';

interface AuthModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Mode determines the copy shown (signup vs signin) */
  mode: AuthModalMode;
}

// Custom auth modal using shadcn components and Privy's headless auth.

export const AuthModal = ({ open, onOpenChange, mode }: AuthModalProps) => {
  const { dangerouslySetUser } = useAuth();
  const [desiredHandle] = useQueryState('handle');

  // Privy hooks
  const { authenticated } = usePrivy();
  const { createWallet: createEvmWallet } = useCreateWallet();
  const { createWallet: createExtendedChainWallet } =
    useCreateExtendedChainWallet();

  // Track pending auth completion data
  const [pendingAuth, setPendingAuth] = useState<{
    user: { email?: { address?: string } };
    isNewUser: boolean;
  } | null>(null);
  const isProcessingRef = useRef(false);

  const state = useAuthModalState({
    mode,
    onSuccess: () => {
      // Modal will close after successful auth
      onOpenChange(false);
    },
  });

  /**
   * Process authentication after Privy's React state is ready.
   * This runs when `authenticated` becomes true AND we have pending auth data.
   */
  useEffect(() => {
    const processAuth = async () => {
      // Only process if we have pending auth data and user is now authenticated
      if (!pendingAuth || !authenticated || isProcessingRef.current) {
        return;
      }

      isProcessingRef.current = true;
      const { user, isNewUser } = pendingAuth;

      try {
        // Now that Privy's React state is ready, create the embedded wallet
        try {
          await createEvmWallet();
        } catch {
          // Wallet might already exist, continue without failing
        }

        // Also provision a Stellar embedded wallet (Tier 2 / extended chains).
        // This will add a Stellar wallet to the Privy user record's linked accounts.
        try {
          console.log('Creating Stellar User');
          await createExtendedChainWallet({ chainType: 'stellar' });
          console.log('Done creating Stellar User');
        } catch {
          // Stellar wallet might already exist or be temporarily unavailable; continue without failing login
        }

        if (isNewUser) {
          // New user - create a Sorbet account
          const newSorbetUser = await signup({
            email: user.email?.address,
            handle: desiredHandle ?? undefined,
          });
          dangerouslySetUser(newSorbetUser);

          // Close modal - signin-content will handle redirect/show IndividualOrBusiness
          state.handleSuccess();
        } else {
          // Existing user - try to fetch their Sorbet profile
          try {
            const sorbetUser = await getMe();
            if (!sorbetUser) {
              throw new Error('No user returned from getMe');
            }
            dangerouslySetUser(sorbetUser);

            // Close modal - signin-content will handle redirect
            state.handleSuccess();
          } catch {
            // Edge case: Privy user exists but Sorbet user doesn't
            // This can happen if signup was interrupted. Create the Sorbet user now.
            const newSorbetUser = await signup({
              email: user.email?.address,
              handle: desiredHandle ?? undefined,
            });
            dangerouslySetUser(newSorbetUser);
            state.handleSuccess();
          }
        }
      } catch (error) {
        console.error('Post-auth error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        toast.error('Error completing authentication', {
          description: errorMessage,
        });
        state.goToStep('email');
      } finally {
        // Clear pending auth data
        setPendingAuth(null);
        isProcessingRef.current = false;
      }
    };

    processAuth();
  }, [
    authenticated,
    pendingAuth,
    createEvmWallet,
    createExtendedChainWallet,
    dangerouslySetUser,
    desiredHandle,
    state,
  ]);

  // Use Privy's headless email login
  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete: ({ user, isNewUser }) => {
      // Don't process immediately - store the data and wait for Privy's React state to update
      setPendingAuth({ user, isNewUser });
    },
    onError: (error) => {
      // Handle different error types
      if (error === 'invalid_credentials') {
        state.setOtpError('Invalid code. Please try again.');
        state.goToStep('otp');
      } else if (error !== 'exited_auth_flow') {
        state.setEmailError(String(error));
        state.goToStep('email');
      }
    },
  });

  // Handle email submission
  const handleEmailSubmit = useCallback(
    async (email: string) => {
      state.goToStep('checking-access');

      try {
        // Check if access restriction is enabled
        const accessConfig = await getAccessConfig();

        if (accessConfig.restrictAccessToExistingUsers) {
          // Check if user has access
          const result = await checkAccess(email);

          if (!result.allowed) {
            // User is not allowed - show waitlist
            state.goToWaitlist(
              result.message ||
                "Thanks for your interest! We've added you to our waitlist and will notify you once we're up again."
            );
            return;
          }
        }

        // User has access - send OTP
        state.goToStep('sending-code');
        await sendCode({ email });

        // Start session recording on login attempt
        if (featureFlags().sessionReplay) {
          posthog.startSessionRecording();
        }

        state.goToStep('otp');
      } catch {
        state.setEmailError('An error occurred. Please try again.');
        state.goToStep('email');
      }
    },
    [sendCode, state]
  );

  // Handle OTP submission
  const handleOtpSubmit = useCallback(
    async (code: string) => {
      state.goToStep('verifying');
      state.setOtpError('');

      try {
        await loginWithCode({ code });
        // onComplete callback will store data, useEffect will process when authenticated
      } catch {
        // Privy's onError callback will handle specific errors.
        // Only reset step here as a fallback if onError doesn't fire.
        if (state.step === 'verifying') {
          state.goToStep('otp');
        }
      }
    },
    [loginWithCode, state]
  );

  // Handle OTP resend
  const handleResend = useCallback(async () => {
    try {
      await sendCode({ email: state.email });
    } catch {
      // Resend failed silently
    }
  }, [sendCode, state.email]);

  // Handle modal close
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        // Reset state when closing
        state.reset();
        setPendingAuth(null);
        isProcessingRef.current = false;
      }
      onOpenChange(newOpen);
    },
    [onOpenChange, state]
  );

  // Handle go back from waitlist
  const handleGoBack = useCallback(() => {
    state.reset();
    onOpenChange(false);
  }, [onOpenChange, state]);

  // Render current step
  const renderStep = () => {
    switch (state.step) {
      case 'email':
      case 'checking-access':
      case 'sending-code':
        return (
          <AuthModalEmail
            mode={state.mode}
            email={state.email}
            emailError={state.emailError}
            step={state.step}
            onEmailChange={state.setEmail}
            onSubmit={handleEmailSubmit}
          />
        );

      case 'otp':
      case 'verifying':
        return (
          <AuthModalOtp
            email={state.email}
            otpError={state.otpError}
            step={state.step}
            onSubmit={handleOtpSubmit}
            onResend={handleResend}
          />
        );

      case 'waitlist':
        return (
          <AuthModalWaitlist
            message={state.waitlistMessage}
            onGoBack={handleGoBack}
          />
        );

      case 'success':
        // Modal will close, show nothing
        return null;

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>{renderStep()}</DialogContent>
    </Dialog>
  );
};
