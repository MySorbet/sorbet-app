'use client';

import { mapToEURWireDetails } from '@/app/invoices/hooks/use-ach-wire-details';
import { BackButton } from '@/components/common/back-button';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import type { SourceDepositInstructionsEUR } from '@/types';

interface EURAccountDetailsProps {
  account: SourceDepositInstructionsEUR | undefined;
  onBack: () => void;
  onClose: () => void;
}

/**
 * EUR Account details screen with SEPA bank details
 */
export const EURAccountDetails = ({
  account,
  onBack,
  onClose,
}: EURAccountDetailsProps) => {
  if (!account) {
    return (
      <div className='flex flex-col gap-4 p-6'>
        <h2 className='text-xl font-semibold text-[#101828]'>
          EUR Account Details
        </h2>
        <p className='text-sm text-[#667085]'>
          EUR account is not available. Please complete verification first.
        </p>
        <Button variant='outline' onClick={onClose} className='w-full'>
          Close
        </Button>
      </div>
    );
  }

  const details = mapToEURWireDetails(account);

  return (
    <div className='flex flex-col gap-4 p-6'>
      {/* Header */}
      <h2 className='text-xl font-semibold text-[#101828]'>
        EUR Account Details
      </h2>

      {/* Details container */}
      <div className='flex flex-col gap-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4'>
        <DetailRow label='Currency' value='EUR' />
        <DetailRow label='Account' value={details.iban} copyable />
        <DetailRow label='Routing' value={details.bic} copyable />
        <DetailRow label='Type' value='Checking' />
        <DetailRow label='Beneficiary' value={details.accountHolderName} />
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
