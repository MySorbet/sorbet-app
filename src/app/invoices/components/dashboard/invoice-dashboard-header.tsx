import { Plus } from 'lucide-react';

import { Header } from '@/components/common/header';
import { Button } from '@/components/ui/button';

/** Header for the invoice dashboard. Will be generalized to support other pages in the future */
export const InvoiceDashboardHeader = ({
  onCreateNew,
}: {
  onCreateNew?: () => void;
}) => {
  return (
    <Header title='Invoicing'>
      <Button onClick={onCreateNew} variant='sorbet'>
        <Plus className='size-4' />
        Create new
      </Button>
    </Header>
  );
};
