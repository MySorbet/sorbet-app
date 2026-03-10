'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useBankExport } from '@/hooks/profile/use-bank-export';

import { SettingsSection } from '../settings-section';

export const VirtualBankSection = () => {
  const { data, isPending } = useBankExport();
  const [isGenerating, setIsGenerating] = useState(false);

  const hasAnyAccount =
    (data?.bridge.kycApproved && (data.bridge.accounts.length ?? 0) > 0) ||
    (data?.due.kycApproved && (data.due.accounts.length ?? 0) > 0);

  const handleExport = async () => {
    if (!data) return;
    setIsGenerating(true);
    try {
      // Dynamically import to keep PDF rendering out of the main bundle
      const { downloadBankDetailsPdf } = await import(
        '@/lib/pdf/bank-details-pdf'
      );
      await downloadBankDetailsPdf(data);
    } catch {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SettingsSection
      label='Virtual Bank Accounts'
      description='Download your bank account details as a PDF'
    >
      <Button
        variant='secondary'
        size='sm'
        type='button'
        onClick={handleExport}
        disabled={isPending || isGenerating || !hasAnyAccount}
        className='h-9 w-[194px] gap-2 rounded-md px-3 shadow-sm'
      >
        <Download className='size-4' />
        {isGenerating ? 'Generating…' : 'Export Bank Details'}
      </Button>
    </SettingsSection>
  );
};
