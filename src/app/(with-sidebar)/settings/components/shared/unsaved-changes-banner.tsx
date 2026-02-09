'use client';

import { RefreshCw } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface UnsavedChangesBannerProps {
  /** Callback when user clicks cancel */
  onCancel: () => void;
  /** Callback when user clicks save */
  onSave: () => void;
  /** Whether the save operation is in progress */
  isSaving?: boolean;
}

export const UnsavedChangesBanner = ({
  onCancel,
  onSave,
  isSaving = false,
}: UnsavedChangesBannerProps) => {
  return (
    <Alert className='mb-6 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2'>
      <RefreshCw className='size-4' />
      <AlertDescription className='flex items-center justify-between'>
        <span>Changes have been made since you last saved</span>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant='sorbet'
            size='sm'
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
