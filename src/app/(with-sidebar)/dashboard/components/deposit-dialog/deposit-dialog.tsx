'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import type { SorbetChain } from '@/api/user/chain';
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
} from '@/components/common/credenza/credenza';
import { useDueVirtualAccounts } from '@/hooks/profile/use-due-virtual-accounts';
import { useAuth } from '@/hooks/use-auth';
import type {
  DueVirtualAccountAEDDetails,
  DueVirtualAccountEURDetails,
  DueVirtualAccountUSDetails,
} from '@/types/due';

import { AEDAccountDetails } from './aed-account-details';
import { DepositOptionsList } from './deposit-options-list';
import { EURAccountDetails } from './eur-account-details';
import { USDAccountDetails } from './usd-account-details';
import { USDCWalletDetails } from './usdc-wallet-details';

export type DepositOption = 'select' | 'usdc' | 'usd' | 'eur' | 'aed';

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Wallet address for USDC deposits (based on selected chain) */
  walletAddress?: string;
  /** Selected chain (Base or Stellar) */
  chain?: SorbetChain;
}

/**
 * Deposit dialog that shows deposit options:
 * - USDC Wallet (QR code + wallet address)
 * - USD Account (ACH/Wire bank details via Due)
 * - EUR Account (SEPA bank details via Due)
 * - AED Account (MENA bank details via Due)
 *
 * USD/EUR/AED are enabled when the user has KYC passed and a Due virtual account.
 * Uses Credenza for responsive behavior (Dialog on desktop, Drawer on mobile)
 */
export const DepositDialog = ({
  open,
  onOpenChange,
  walletAddress,
  chain = 'base',
}: DepositDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<DepositOption>('select');
  const { user } = useAuth();

  const { data: dueVirtualAccounts } = useDueVirtualAccounts({
    enabled: !!user?.id,
  });

  const usdAccount = dueVirtualAccounts?.find((a) => a.schema === 'bank_us');
  const eurAccount = dueVirtualAccounts?.find((a) => a.schema === 'bank_sepa');
  const aedAccount = dueVirtualAccounts?.find((a) => a.schema === 'bank_mena');


  const hasUSDAccount = !!usdAccount;
  const hasEURAccount = !!eurAccount;
  const hasAEDAccount = !!aedAccount;

  const usdDetails = usdAccount?.account?.details as
    | DueVirtualAccountUSDetails
    | undefined;
  const eurDetails = eurAccount?.account?.details as
    | DueVirtualAccountEURDetails
    | undefined;
  const aedDetails = aedAccount?.account?.details as
    | DueVirtualAccountAEDDetails
    | undefined;

  const handleOptionSelect = (option: DepositOption) => {
    setSelectedOption(option);
  };

  const handleBack = () => {
    setSelectedOption('select');
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset to selection after close animation
    setTimeout(() => setSelectedOption('select'), 300);
  };

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent className='p-0 md:max-w-sm'>
        <VisuallyHidden asChild>
          <CredenzaTitle>Sorbet Deposit</CredenzaTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <CredenzaDescription>
            Choose a deposit method for your Sorbet wallet
          </CredenzaDescription>
        </VisuallyHidden>

        <AnimatePresence mode='wait'>
          {selectedOption === 'select' && (
            <FadeIn key='select'>
              <DepositOptionsList
                onSelect={handleOptionSelect}
                onClose={handleClose}
                hasUSDAccount={hasUSDAccount}
                hasEURAccount={hasEURAccount}
                hasAEDAccount={hasAEDAccount}
              />
            </FadeIn>
          )}

          {selectedOption === 'usdc' && (
            <FadeIn key='usdc'>
              <USDCWalletDetails
                chain={chain}
                walletAddress={walletAddress ?? ''}
                onBack={handleBack}
                onClose={handleClose}
              />
            </FadeIn>
          )}

          {selectedOption === 'usd' && (
            <FadeIn key='usd'>
              <USDAccountDetails
                details={usdDetails}
                onBack={handleBack}
                onClose={handleClose}
              />
            </FadeIn>
          )}

          {selectedOption === 'eur' && (
            <FadeIn key='eur'>
              <EURAccountDetails
                details={eurDetails}
                onBack={handleBack}
                onClose={handleClose}
              />
            </FadeIn>
          )}

          {selectedOption === 'aed' && (
            <FadeIn key='aed'>
              <AEDAccountDetails
                details={aedDetails}
                onBack={handleBack}
                onClose={handleClose}
              />
            </FadeIn>
          )}
        </AnimatePresence>
      </CredenzaContent>
    </Credenza>
  );
};

/** Fade in animation wrapper for screen transitions */
const FadeIn = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className='min-w-full'
    >
      {children}
    </motion.div>
  );
};
