'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

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

import { useDeleteAccount } from '../../hooks/use-delete-account';
import { SettingsSection } from '../settings-section';

export const DeleteAccountSection = () => {
  const { mutate: deleteAccount, isPending } = useDeleteAccount();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    deleteAccount();
    setShowConfirm(false);
  };

  return (
    <SettingsSection
      label="Delete account"
      description="This will permanently delete your Sorbet account. Your profile will be permanently deleted by completing this action."
    >
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="h-9 px-2 text-xs leading-none"
        aria-label="Delete account"
      >
        Delete account
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-4 pt-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="font-semibold text-amber-900">⚠️ Export Your Wallet First</p>
                <p className="mt-2 text-sm text-amber-800">
                  Make sure you've exported your wallet private key from the{' '}
                  <strong>Wallet section above</strong> before deleting your account. Your embedded wallet will be permanently deleted and you'll lose access to your funds without the private key.
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-medium">This action will permanently:</p>
                <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                  <li>Delete your Sorbet account and all settings</li>
                  <li>Delete your embedded wallet (funds are only accessible with private key)</li>
                  <li>Remove all your data from our systems</li>
                  <li>Free up your handle and email for reuse</li>
                </ul>
                <p className="pt-2 text-xs text-muted-foreground">
                  Note: Your invoices will be kept for compliance and tax purposes, but will be anonymized.
                </p>
              </div>

              <p className="text-sm font-semibold text-destructive">
                This is permanent and cannot be undone. You can create a new account with the same email after deletion.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* match dialog buttons to compact size */}
            <AlertDialogCancel
              disabled={isPending}
              className="h-7 px-3 text-xs leading-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="h-7 px-3 text-xs leading-none bg-destructive hover:bg-destructive/90"
            >
              {isPending ? 'Deleting...' : 'Yes, delete my account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsSection>
  );
};