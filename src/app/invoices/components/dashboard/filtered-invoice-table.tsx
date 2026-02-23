import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import React from 'react';

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

import { InvoiceTable } from './invoice-table';
import { Invoice } from '../../schema';
import { checkOverdue, InvoiceStatus } from '../../utils';

export type InvoiceStatusFilter = 'All' | InvoiceStatus | 'Overdue';

interface FilteredInvoiceTableProps {
  invoices: Invoice[];
  isLoading?: boolean;
  onInvoiceClick?: (invoice: Invoice) => void;
  onInvoiceStatusChange?: (invoice: Invoice, status: InvoiceStatus) => void;
  onCreateInvoice?: () => void;
}

export const FilteredInvoiceTable: React.FC<FilteredInvoiceTableProps> = ({
  invoices,
  isLoading = false,
  onInvoiceClick,
  onInvoiceStatusChange,
  onCreateInvoice,
}) => {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<InvoiceStatusFilter>('All');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const pageSize = 10;

  // Filter logic
  const filteredInvoices = React.useMemo(() => {
    return invoices.filter((invoice) => {
      // Search
      const matchesSearch =
        invoice.toName.toLowerCase().includes(searchValue.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchValue.toLowerCase());
      
      if (!matchesSearch) return false;

      // Status
      if (statusFilter !== 'All') {
        const currentStatus = checkOverdue(invoice.dueDate, invoice.status);
        if (currentStatus !== statusFilter) return false;
      }

      return true;
    });
  }, [invoices, searchValue, statusFilter]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, statusFilter]);

  const totalCount = filteredInvoices.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Card className='relative h-fit p-6 w-full'>
      {/* Filter Controls */}
      <div className='mb-4 flex flex-col gap-3 sm:flex-row justify-end'>
        {/* Search Input */}
        <div className='relative flex-1 sm:max-w-[240px]'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            type='text'
            placeholder='Search'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='pl-9'
          />
        </div>

        {/* Status Filter */}
        <div className='relative w-full sm:w-[120px]'>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as InvoiceStatusFilter)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Filters' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>All</SelectItem>
              <SelectItem value='Open'>Open</SelectItem>
              <SelectItem value='Paid'>Paid</SelectItem>
              <SelectItem value='Overdue'>Overdue</SelectItem>
              <SelectItem value='Cancelled'>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <InvoiceTable
        invoices={paginatedInvoices}
        isLoading={isLoading}
        onInvoiceClick={onInvoiceClick}
        onInvoiceStatusChange={onInvoiceStatusChange}
        onCreateInvoice={onCreateInvoice}
      />

      {/* Pagination Footer */}
      <div className='mt-4 flex items-center justify-between border-t pt-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={!hasPrevPage}
          className='gap-1'
        >
          <ChevronLeft className='size-4' />
          <span>Previous</span>
        </Button>

        <span className='text-muted-foreground text-sm flex-1 text-center font-medium'>
          {totalCount > 0 ? `${startItem}-${endItem} of ${totalCount}` : '0 of 0'}
        </span>

        <Button
          variant='outline'
          size='sm'
          onClick={() => setCurrentPage(p => p + 1)}
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
