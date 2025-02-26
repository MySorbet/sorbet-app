import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

/** Header for the invoice dashboard. Will be generalized to support other pages in the future */
export const InvoiceDashboardHeader = ({
  onCreateNew,
}: {
  onCreateNew?: () => void;
}) => {
  return (
    <div className='border-border flex w-full items-center justify-center border-b px-6 py-4'>
      <div className='flex w-full max-w-7xl items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold'>Invoicing</h1>
        <Button onClick={onCreateNew} variant='sorbet'>
          <Plus className='mr-2 h-4 w-4' />
          Create new
        </Button>
      </div>
    </div>
  );
};
