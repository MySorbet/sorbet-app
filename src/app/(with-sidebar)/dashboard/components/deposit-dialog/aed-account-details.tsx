'use client';

import { BackButton } from '@/components/common/back-button';
import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import type { DueVirtualAccountAEDDetails } from '@/types/due';

interface AEDAccountDetailsProps {
  details: DueVirtualAccountAEDDetails | undefined;
  onBack: () => void;
  onClose: () => void;
}

/**
 * AED Account details screen with MENA bank details (via Due)
 */
export const AEDAccountDetails = ({
  details,
  onBack,
  onClose,
}: AEDAccountDetailsProps) => {
  if (!details) {
    return (
      <div className='flex flex-col gap-4 p-6'>
        <h2 className='text-xl font-semibold text-[#101828]'>
          AED Account Details
        </h2>
        <p className='text-sm text-[#667085]'>
          AED account is not available. Please complete verification first.
        </p>
        <Button variant='outline' onClick={onClose} className='w-full'>
          Close
        </Button>
      </div>
    );
  }

  const beneficiaryName =
    details.accountType === 'business' && details.companyName
      ? details.companyName
      : [details.firstName, details.lastName].filter(Boolean).join(' ') ||
        'N/A';

  return (
    <div className='flex flex-col gap-4 p-6'>
      {/* Header */}
      <h2 className='text-xl font-semibold text-[#101828]'>
        AED Account Details
      </h2>

      {/* Details container */}
      <div className='flex flex-col gap-3 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4'>
        <DetailRow label='Currency' value='AED' />
        <DetailRow label='IBAN' value={details.IBAN} copyable />
        {details.swiftCode && (
          <DetailRow label='SWIFT Code' value={details.swiftCode} copyable />
        )}
        <DetailRow label='Beneficiary' value={beneficiaryName} />
        {details.bankName && (
          <DetailRow label='Bank' value={details.bankName} />
        )}
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
