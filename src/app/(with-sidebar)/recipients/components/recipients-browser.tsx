'use client';

import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { RecipientAPI } from '@/api/recipients/types';
import { DocsButton } from '@/components/common/docs-button';
import { Button } from '@/components/ui/button';
import { useAfter } from '@/hooks/use-after';

import { useAddRecipientOpen } from '../hooks/use-add-recipient-open';
import { useCreateRecipient } from '../hooks/use-create-recipient';
import { useDeleteRecipient } from '../hooks/use-delete-recipient';
import { useRecipients } from '../hooks/use-recipients';
import { useRecipientDetails } from '../hooks/use-recipient-details';
import { useSelectedRecipient } from '../hooks/use-selected-recipient';
import { useSendTo } from '../hooks/use-send-to';
import { AddRecipientSheet } from './add-recipient-sheet';
import {
  FilteredRecipientsTable,
  RecipientTypeFilter,
} from './filtered-recipients-table';
import { MigrateRecipientSheet } from './migrate-recipient-sheet';
import { RecipientSheet } from './recipient-sheet';
import { SendToDialog } from './send/send-to-dialog';

const PAGE_SIZE = 10;

/** Check if recipient is a Bridge recipient that needs migration */
const needsMigration = (recipient: RecipientAPI): boolean => {
  // Legacy Bridge recipients have type 'usd' or 'eur'
  // Due Network recipients have types like 'usd_ach', 'eur_sepa', etc.
  return recipient.type === 'usd' || recipient.type === 'eur';
};

/** Main container for the recipients page with header, filters, and table */
export const RecipientsBrowser: React.FC = () => {
  const { data: recipients, isLoading } = useRecipients();
  const [addSheetOpen, setAddSheetOpen] = useAddRecipientOpen();
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const { selectedRecipient, setSelectedRecipientId } =
    useSelectedRecipient(recipients);

  const clearSelectedRecipient = useAfter(
    () => setSelectedRecipientId(null),
    300
  );

  const { set } = useSendTo();

  const { mutateAsync: createRecipient } = useCreateRecipient();
  const { mutateAsync: deleteRecipient, isPending: isDeleting } =
    useDeleteRecipient();

  // Migration sheet state
  const [migrationRecipientId, setMigrationRecipientId] = useState<string | null>(null);
  const migrationRecipient = recipients?.find((r) => r.id === migrationRecipientId) ?? null;
  const { data: migrationRecipientDetails } = useRecipientDetails(
    migrationRecipientId ?? '',
    {
      enabled: !!migrationRecipientId && migrationRecipient?.type !== 'crypto',
    }
  );

  // Filter states
  const [searchValue, setSearchValue] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<RecipientTypeFilter>('all');

  // Filtered data
  const [filteredRecipients, setFilteredRecipients] = useState<RecipientAPI[]>(
    []
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter recipients based on search and type
  useEffect(() => {
    if (!recipients) {
      setFilteredRecipients([]);
      return;
    }

    let filtered = recipients;

    // Search filter - search by name/label
    if (searchValue) {
      filtered = filtered.filter((recipient) =>
        recipient.label.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Type filter - group by currency
    if (typeFilter !== 'all') {
      filtered = filtered.filter((recipient) => {
        // Match by currency prefix (usd matches usd, usd_ach, usd_wire, usd_swift)
        // eur matches eur, eur_sepa, eur_swift
        // aed matches aed_local
        // crypto matches crypto exactly
        if (typeFilter === 'crypto') {
          return recipient.type === 'crypto';
        }
        return recipient.type.startsWith(typeFilter);
      });
    }

    setFilteredRecipients(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchValue, typeFilter, recipients]);

  // Calculate pagination
  const totalCount = filteredRecipients.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Get current page data
  const paginatedRecipients = filteredRecipients.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSubmit = async (recipient: Parameters<typeof createRecipient>[0]) => {
    await createRecipient(recipient);
    setAddSheetOpen(false);
  };

  const handleRowClick = (recipientId: string) => {
    setSelectedRecipientId(recipientId);
    setViewSheetOpen(true);
  };

  const handleDelete = (recipientId: string) => {
    deleteRecipient(recipientId);
  };

  const handleSend = (recipientId: string) => {
    // Find the recipient
    const recipient = recipients?.find((r) => r.id === recipientId);
    
    if (!recipient) {
      // Fallback: proceed with send flow if recipient not found
      set({ recipientId });
      return;
    }

    // Check if migration is needed
    if (needsMigration(recipient)) {
      // Open migration sheet instead of send flow
      setMigrationRecipientId(recipientId);
    } else {
      // Proceed with send flow
      set({ recipientId });
    }
  };

  const handleMigrationSuccess = () => {
    // After successful migration, proceed with send flow
    if (migrationRecipientId) {
      set({ recipientId: migrationRecipientId });
    }
    setMigrationRecipientId(null);
  };

  return (
    <div className='@container size-full w-full max-w-7xl space-y-4 px-[1px] sm:space-y-6 sm:px-0'>
      {/* Header Section */}
      <div className='flex w-full flex-col items-start justify-between gap-4 border-b px-4 pb-4 pt-[1px] sm:flex-row sm:items-center sm:gap-6 sm:px-6 md:min-h-[72px]'>
        {/* Mobile: Title + Buttons in one row */}
        <div className='flex w-full items-center justify-between sm:hidden'>
          <h2 className='text-xl font-semibold'>Recipients</h2>
          <div className='flex shrink-0 gap-2'>
            <DocsButton />
            <Button
              variant='sorbet'
              onClick={() => setAddSheetOpen(true)}
              size='icon'
              className='size-9'
              aria-label='Add Recipient'
            >
              <Plus className='size-4' />
            </Button>
          </div>
        </div>

        {/* Desktop: Original layout */}
        <div className='hidden min-w-0 flex-1 sm:block'>
          <h2 className='text-2xl font-semibold'>Recipients</h2>
          <p className='text-muted-foreground text-sm'>
            Add crypto wallets and bank accounts
          </p>
        </div>

        <div className='hidden shrink-0 gap-3 sm:flex'>
          <DocsButton />
          <Button
            variant='sorbet'
            onClick={() => setAddSheetOpen(true)}
            className='gap-2'
            size='sm'
          >
            <Plus className='size-4' />
            <span>Add new</span>
          </Button>
        </div>
      </div>

      {/* Filtered Table */}
      <FilteredRecipientsTable
        recipients={paginatedRecipients}
        isLoading={isLoading}
        searchValue={searchValue}
        typeFilter={typeFilter}
        onSearchChange={setSearchValue}
        onTypeFilterChange={setTypeFilter}
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        onSend={handleSend}
        onAdd={() => setAddSheetOpen(true)}
      />

      {/* Dialogs and Sheets */}
      <SendToDialog onAdd={() => setAddSheetOpen(true)} />
      <AddRecipientSheet
        open={addSheetOpen}
        setOpen={setAddSheetOpen}
        onSubmit={handleSubmit}
      />
      <RecipientSheet
        open={viewSheetOpen}
        setOpen={setViewSheetOpen}
        onSend={() => {
          selectedRecipient && set({ recipientId: selectedRecipient.id });
          setViewSheetOpen(false);
          clearSelectedRecipient();
        }}
        onAnimationEnd={() => setSelectedRecipientId(null)}
        recipient={selectedRecipient}
        onDelete={async (recipientId) => {
          await deleteRecipient(recipientId);
          setViewSheetOpen(false);
        }}
        isDeleting={isDeleting}
      />
      {/* Migration Sheet */}
      <MigrateRecipientSheet
        open={!!migrationRecipientId}
        setOpen={(open) => {
          if (!open) {
            setMigrationRecipientId(null);
          }
        }}
        recipient={migrationRecipient}
        recipientDetails={migrationRecipientDetails ?? null}
        onSuccess={handleMigrationSuccess}
      />
    </div>
  );
};
