'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import {
    Credenza,
    CredenzaContent,
    CredenzaDescription,
    CredenzaTitle,
} from '@/components/common/credenza/credenza';
import type { SorbetChain } from '@/api/user/chain';
import type {
    BridgeCustomer,
    SourceDepositInstructions,
    SourceDepositInstructionsEUR,
} from '@/types';

import { DepositOptionsList } from './deposit-options-list';
import { EURAccountDetails } from './eur-account-details';
import { USDAccountDetails } from './usd-account-details';
import { USDCWalletDetails } from './usdc-wallet-details';

export type DepositOption = 'select' | 'usdc' | 'usd' | 'eur';

interface DepositDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Wallet address for USDC deposits (based on selected chain) */
    walletAddress?: string;
    /** Selected chain (Base or Stellar) */
    chain?: SorbetChain;
    /** Bridge customer data containing virtual accounts */
    bridgeCustomer?: BridgeCustomer;
}

/**
 * Deposit dialog that shows three deposit options:
 * - USDC Wallet (QR code + wallet address)
 * - USD Account (ACH/Wire bank details)
 * - EUR Account (SEPA bank details)
 *
 * Uses Credenza for responsive behavior (Dialog on desktop, Drawer on mobile)
 *
 */
export const DepositDialog = ({
    open,
    onOpenChange,
    walletAddress,
    chain = 'base',
    bridgeCustomer,
}: DepositDialogProps) => {
    const [selectedOption, setSelectedOption] = useState<DepositOption>('select');

    // Check account availability
    const hasUSDAccount = !!bridgeCustomer?.virtual_account;
    const hasEURAccount = !!bridgeCustomer?.virtual_account_eur;

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
                                account={bridgeCustomer?.virtual_account?.source_deposit_instructions}
                                onBack={handleBack}
                                onClose={handleClose}
                            />
                        </FadeIn>
                    )}

                    {selectedOption === 'eur' && (
                        <FadeIn key='eur'>
                            <EURAccountDetails
                                account={bridgeCustomer?.virtual_account_eur?.source_deposit_instructions}
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
