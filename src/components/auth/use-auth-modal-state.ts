'use client';

import { useState, useCallback } from 'react';

export type AuthModalStep =
    | 'email'
    | 'checking-access'
    | 'sending-code'
    | 'otp'
    | 'verifying'
    | 'waitlist'
    | 'success';

export type AuthModalMode = 'signup' | 'signin';

interface UseAuthModalStateOptions {
    mode: AuthModalMode;
    onSuccess?: () => void;
}

interface AuthModalState {
    step: AuthModalStep;
    email: string;
    emailError: string;
    otpError: string;
    waitlistMessage: string;
}

export function useAuthModalState({ mode, onSuccess }: UseAuthModalStateOptions) {
    const [state, setState] = useState<AuthModalState>({
        step: 'email',
        email: '',
        emailError: '',
        otpError: '',
        waitlistMessage: '',
    });

    const setEmail = useCallback((email: string) => {
        setState((prev) => ({ ...prev, email, emailError: '' }));
    }, []);

    const setEmailError = useCallback((emailError: string) => {
        setState((prev) => ({ ...prev, emailError }));
    }, []);

    const setOtpError = useCallback((otpError: string) => {
        setState((prev) => ({ ...prev, otpError }));
    }, []);

    const goToStep = useCallback((step: AuthModalStep) => {
        setState((prev) => ({ ...prev, step }));
    }, []);

    const goToWaitlist = useCallback((message: string) => {
        setState((prev) => ({
            ...prev,
            step: 'waitlist',
            waitlistMessage: message,
        }));
    }, []);

    const reset = useCallback(() => {
        setState({
            step: 'email',
            email: '',
            emailError: '',
            otpError: '',
            waitlistMessage: '',
        });
    }, []);

    const handleSuccess = useCallback(() => {
        setState((prev) => ({ ...prev, step: 'success' }));
        onSuccess?.();
    }, [onSuccess]);

    return {
        ...state,
        mode,
        setEmail,
        setEmailError,
        setOtpError,
        goToStep,
        goToWaitlist,
        reset,
        handleSuccess,
    };
}

export type AuthModalStateReturn = ReturnType<typeof useAuthModalState>;
