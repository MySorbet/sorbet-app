import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { RecipientAPI, RecipientType } from '@/api/recipients/types';
import { RecipientsTableCore } from '@/app/(with-sidebar)/recipients/components/recipients-table-core';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type RecipientTypeFilter = RecipientType | 'all';

interface FilteredRecipientsTableProps {
  recipients: RecipientAPI[];
  isLoading?: boolean;
  searchValue?: string;
  typeFilter?: RecipientTypeFilter;
  onSearchChange?: (value: string) => void;
  onTypeFilterChange?: (type: RecipientTypeFilter) => void;
  // Pagination props
  currentPage?: number;
  totalCount?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  // Row actions
  onRowClick?: (recipientId: string) => void;
  onDelete?: (recipientId: string) => void;
  onSend?: (recipientId: string) => void;
  onAdd?: () => void;
}

/** Renders a recipients table in a card with filters and pagination controls */
export const FilteredRecipientsTable: React.FC<
  FilteredRecipientsTableProps
> = ({
  recipients,
  isLoading = false,
  searchValue = '',
  typeFilter = 'all',
  onSearchChange,
  onTypeFilterChange,
  currentPage = 1,
  totalCount = 0,
  pageSize = 10,
  hasNextPage = false,
  hasPrevPage = false,
  onNextPage,
  onPrevPage,
  onRowClick,
  onDelete,
  onSend,
  onAdd,
}) => {
  // Calculate display range for pagination
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Card className='relative h-fit p-6'>
      {/* Filter Controls */}
      <div className='mb-4 flex flex-col gap-3 sm:flex-row'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <Input
            type='text'
            placeholder='Search recipients'
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div className='relative w-full sm:w-[180px]'>
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              onTypeFilterChange?.(value as RecipientTypeFilter)
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Currency Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              <SelectItem value='crypto_base'>Crypto (Base)</SelectItem>
              <SelectItem value='crypto_stellar'>Crypto (Stellar)</SelectItem>
              <SelectItem value='usd'>USD</SelectItem>
              <SelectItem value='eur'>EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recipients Table */}
      <RecipientsTableCore
        recipients={recipients}
        isLoading={isLoading}
        onRowClick={onRowClick}
        onDelete={onDelete}
        onSend={onSend}
        onAdd={onAdd}
      />

      {/* Pagination Footer */}
      <div className='mt-4 flex items-center justify-between border-t pt-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={onPrevPage}
          disabled={!hasPrevPage}
          className='gap-1'
        >
          <ChevronLeft className='size-4' />
          <span>Previous</span>
        </Button>

        <span className='text-muted-foreground text-sm'>
          {totalCount > 0
            ? `${startItem}-${endItem} of ${totalCount}`
            : '0 of 0'}
        </span>

        <Button
          variant='outline'
          size='sm'
          onClick={onNextPage}
          disabled={!hasNextPage}
          className='gap-1'
        >
          <span>Next</span>
          <ChevronRight className='size-4' />
        </Button>
      </div>
    </Card>
  );
};
