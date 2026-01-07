'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/common/spinner';
import { AuthModalMode, AuthModalStep } from './use-auth-modal-state';

/** Email validation regex - matches common email patterns */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AuthModalEmailProps {
    mode: AuthModalMode;
    email: string;
    emailError: string;
    step: AuthModalStep;
    onEmailChange: (email: string) => void;
    onSubmit: (email: string) => void;
}

const COPY = {
    signup: {
        title: "Let's get you started",
        subtitle: 'Set up your account in under a minute',
    },
    signin: {
        title: 'Hey, welcome back 👋',
        subtitle: 'Access your workspace.',
    },
} as const;

/** Email input step for the auth modal */
export const AuthModalEmail = ({
    mode,
    email,
    emailError,
    step,
    onEmailChange,
    onSubmit,
}: AuthModalEmailProps) => {
    const [localError, setLocalError] = useState('');
    const isLoading = step === 'checking-access' || step === 'sending-code';
    const copy = COPY[mode];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');

        // Validate email format
        if (!email.trim()) {
            setLocalError('Email is required');
            return;
        }

        if (!EMAIL_REGEX.test(email)) {
            setLocalError("Looks like there's a typo in the email.");
            return;
        }

        onSubmit(email);
    };

    const displayError = emailError || localError;
    const hasError = Boolean(displayError);

    return (
        <div className="flex flex-col">
            {/* Header with logo */}
            <div className="flex items-center gap-2 mb-6">
                <Image
                    src="/svg/social/black-sorbet-logo.svg"
                    width={32}
                    height={32}
                    className="size-8"
                    alt="Sorbet"
                    priority
                />
                <span className="text-primary font-jura font-bold text-[24.3px] leading-[1.4] tracking-[0]">
                    SORBET
                </span>
            </div>

            {/* Title and subtitle */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">{copy.title}</h2>
                <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="e.g johnsnow@xyz.com"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            disabled={isLoading}
                            autoFocus
                            autoComplete="email"
                            className={hasError ? 'border-destructive focus:ring-destructive' : ''}
                        />
                        {hasError && (
                            <p className="text-sm text-destructive">{displayError}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !email.trim()}
                        className="w-full"
                    >
                        {isLoading && <Spinner className="mr-2" />}
                        Continue
                    </Button>
                </div>
            </form>

            {/* Terms footer */}
            <p className="text-xs text-muted-foreground text-center mt-6">
                By clicking continue, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-foreground">
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    );
};
