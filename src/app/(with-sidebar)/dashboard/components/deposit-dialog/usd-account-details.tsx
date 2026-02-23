'use client';

import { mapToACHWireDetails } from '@/app/invoices/hooks/use-ach-wire-details';
import { BackButton } from '@/components/common/back-button';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import type { SourceDepositInstructions } from '@/types';

interface USDAccountDetailsProps {
  account: SourceDepositInstructions | undefined;
  onBack: () => void;
  onClose: () => void;
}

/**
 * USD Account details screen with ACH/Wire bank details
 */
export const USDAccountDetails = ({
  account,
  onBack,
  onClose,
}: USDAccountDetailsProps) => {
  if (!account) {
    return (
      <div className='flex flex-col gap-4 p-6'>
        <h2 className='text-xl font-semibold text-[#101828]'>
          USD Account Details
        </h2>
        <p className='text-sm text-[#667085]'>
          USD account is not available. Please complete verification first.
        </p>
        <Button variant='outline' onClick={onClose} className='w-full'>
          Close
        </Button>
      </div>
    );
  }

  const details = mapToACHWireDetails(account);

  return (
    <div className='flex flex-col gap-4 p-6'>
      {/* Header */}
      <h2 className='text-xl font-semibold text-[#101828]'>
        USD Account Details
      </h2>

      {/* Details container */}
      <div className='flex flex-col gap-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4'>
        <DetailRow label='Currency' value='USD' />
        <DetailRow label='Account' value={details.accountNumber} copyable />
        <DetailRow label='Routing' value={details.routingNumber} copyable />
        <DetailRow label='Type' value='Checking' />
        <DetailRow
          label='Beneficiary'
          value={
            <>
              {details.beneficiary.name}
              <br />
              <span className='text-[#667085]'>
                {details.beneficiary.address}
              </span>
            </>
          }
        />
        <DetailRow
          label='Bank'
          value={
            <>
              {details.bank.name}
              <br />
              <span className='text-[#667085]'>{details.bank.address}</span>
            </>
          }
        />
      </div>

      {/* Buttons */}
      <div className='flex gap-3'>
        <BackButton onClick={onBack}>Back</BackButton>
        <Button variant='outline' onClick={onClose} className='flex-1'>
          Close
        </Button>
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
}

/** Individual row for account detail with optional copy button */
const DetailRow = ({ label, value, copyable }: DetailRowProps) => {
  return (
    <div className='flex items-start gap-4'>
      <span className='min-w-[80px] text-sm text-[#667085]'>{label}</span>
      {copyable && typeof value === 'string' ? (
        <CopyButton
          stringToCopy={value}
          variant='ghost'
          className='h-auto gap-1 p-0 text-sm font-medium text-[#344054] hover:bg-transparent'
          copyIconClassName='size-4 text-[#98A2B3]'
        >
          {value}
        </CopyButton>
      ) : (
        <span className='text-sm font-medium text-[#344054]'>{value}</span>
      )}
    </div>
  );
};
