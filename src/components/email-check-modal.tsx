'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface EmailCheckModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback when email is verified and user should proceed to Privy */
  onEmailVerified: (email: string) => void;
}

/** Modal that checks if a user's email exists in the database before allowing Privy authentication */
export const EmailCheckModal = ({
  open,
  onOpenChange,
  onEmailVerified,
}: EmailCheckModalProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { checkAccess } = await import('@/api/auth');
      const result = await checkAccess(email);

      if (result.allowed) {
        onEmailVerified(email);
        onOpenChange(false);
        setEmail('');
      } else {
        setError(
          result.message ||
            'Sorry, our platform is currently limited to existing users. Please check back later.'
        );
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Email check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEmail('');
      setError('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <Image
              src='/svg/logo.svg'
              width={40}
              height={40}
              className='size-10'
              alt='Sorbet'
              priority
            />
            <span className='text-primary text-sm font-semibold tracking-wide'>
              SORBET
            </span>
          </div>
          <DialogTitle>Sign in to Sorbet</DialogTitle>
          <DialogDescription>
            Enter your email to continue
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <Input
              type='email'
              placeholder='your@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
            {error && (
              <p className='text-sm text-destructive'>{error}</p>
            )}
          </div>
          <DialogFooter className='mt-6'>
            <Button type='submit' disabled={loading || !email} className='w-full'>
              {loading ? 'Checking...' : 'Continue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

