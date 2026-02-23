'use client';

import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useDeleteAccount } from '../../hooks/use-delete-account';
import { SettingsSection } from '../settings-section';

const CONFIRMATION_TEXT = 'DELETE';

export const DeleteAccountSection = () => {
  const { deleteAccount, isDeleting } = useDeleteAccount();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');

  const handleDelete = () => {
    if (confirmationInput !== CONFIRMATION_TEXT) {
      toast.error(`Please type "${CONFIRMATION_TEXT}" to confirm`);
      return;
    }
    // Delete account directly after confirmation
    deleteAccount();
    setShowConfirm(false);
    setConfirmationInput('');
  };

  return (
    <SettingsSection
      label='Delete account'
      description='This will permanently delete your Sorbet account. Your profile will be permanently deleted by completing this action.'
    >
      <Button
        variant='destructive'
        size='sm'
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className='h-9 w-fit self-start px-3 text-xs leading-none'
        aria-label='Delete account'
      >
        Delete account
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className='max-w-md'>
          <AlertDialogHeader>
            <div className='flex items-center gap-3'>
              <div className='bg-destructive/10 rounded-full p-2'>
                <AlertTriangle className='text-destructive h-5 w-5' />
              </div>
              <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className='space-y-4 pt-4'>
              <div className='rounded-lg border border-amber-200 bg-amber-50 p-4'>
                <p className='font-semibold text-amber-900'>
                  ⚠️ Export Your Wallet First
                </p>
                <p className='mt-2 text-sm text-amber-800'>
                  Make sure you've exported your wallet private key from the{' '}
                  <strong>Wallet section above</strong> before deleting your
                  account. Your embedded wallet will be permanently deleted and
                  you'll lose access to your funds without the private key.
                </p>
              </div>

              <div className='space-y-2 text-sm'>
                <p className='font-medium'>This action will permanently:</p>
                <ul className='text-muted-foreground list-inside list-disc space-y-1'>
                  <li>Delete your Sorbet account and all settings</li>
                  <li>
                    Delete your embedded wallet (funds are only accessible with
                    private key)
                  </li>
                  <li>
                    Delete all your invoices, recipients, and invoicing details
                  </li>
                  <li>Delete your Bridge customer account and KYC data</li>
                  <li>Remove all your data from our systems</li>
                  <li>Free up your handle and email for reuse</li>
                </ul>
              </div>

              <p className='text-destructive text-sm font-semibold'>
                This is permanent and cannot be undone. You can create a new
                account with the same email after deletion.
              </p>

              <div className='space-y-2 pt-2'>
                <Label
                  htmlFor='delete-confirmation'
                  className='text-sm font-medium'
                >
                  Type{' '}
                  <span className='font-mono font-bold'>
                    {CONFIRMATION_TEXT}
                  </span>{' '}
                  to confirm:
                </Label>
                <Input
                  id='delete-confirmation'
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder={CONFIRMATION_TEXT}
                  disabled={isDeleting}
                  className='font-mono'
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* match dialog buttons to compact size */}
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => {
                setShowConfirm(false);
                setConfirmationInput('');
              }}
              className='h-7 px-3 text-xs leading-none'
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || confirmationInput !== CONFIRMATION_TEXT}
              className='bg-destructive hover:bg-destructive/90 h-7 px-3 text-xs leading-none'
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  );
};
