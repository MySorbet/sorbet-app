'use client';

import { AlertCircle, Copy } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { FC } from 'react';
import { CircleFlag } from 'react-circle-flags';

import { CopyButton } from '@/components/common/copy-button/copy-button';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type {
    DueVirtualAccountUSDetails,
    DueVirtualAccountEURDetails,
    DueVirtualAccountAEDDetails,
} from '@/types/due';

// Fee & Settlement terms based on Due pricing
// Data from Due documentation
const FEE_DATA = {
    usd: {
        ach: {
            settlementTime: '1-3 business days',
            variableFee: '0%',
            fixedFee: 'USD 0.50',
            minimumTransaction: 'USD 50',
        },
        wire: {
            settlementTime: 'Same business day',
            variableFee: '0%',
            fixedFee: 'USD 25.00',
            minimumTransaction: 'USD 50',
        },
        swift: {
            settlementTime: '1-5 business day',
            variableFee: '0.25%',
            fixedFee: 'USD 40.00',
            minimumTransaction: 'USD 50',
            intermediaryBank: 'Wells Fargo Bank, N.A.',
            intermediarySwift: 'WFBIUS6S',
        },
    },
    eur: {
        sepa: {
            settlementTime: 'Same day / Next business day',
            variableFee: '0%',
            fixedFee: 'EUR 30.00',
            minimumTransaction: 'EUR 100',
        },
        swift: {
            settlementTime: 'Same day / Next business day',
            variableFee: '0%',
            fixedFee: 'EUR 30.00',
            minimumTransaction: 'EUR 100',
            intermediaryBank: 'Wells Fargo Bank, N.A.',
            intermediarySwift: 'WFBIUS6S',
        },
    },
    aed: {
        settlementTime: '1-2 business days',
        variableFee: '0%',
        fixedFee: 'AED 2.00',
        minimumTransaction: 'AED 100',
    },
};

type USDTransferType = 'ach' | 'wire' | 'swift';
type EURTransferType = 'sepa' | 'swift';

/** USD Account Details with ACH/WIRE/SWIFT tabs */
const USDAccountDetails = ({
    details,
}: {
    details: DueVirtualAccountUSDetails | null | undefined;
}) => {
    const [transferType, setTransferType] = useState<USDTransferType>('ach');
    const fees = FEE_DATA.usd[transferType];

    // Graceful handling of missing details
    if (!details) {
        return <AccountDetailsError currency='USD' />;
    }

    // Get the appropriate routing number based on transfer type
    const getRoutingNumber = () => {
        switch (transferType) {
            case 'ach':
                return details.routingNumberACH || details.routingNumber;
            case 'wire':
                return details.routingNumberWire || details.routingNumber;
            default:
                return details.routingNumber;
        }
    };

    // Get beneficiary name
    const getBeneficiaryName = () => {
        if (details.accountType === 'business' && details.companyName) {
            return details.companyName;
        }
        return [details.firstName, details.lastName].filter(Boolean).join(' ') || details.accountName || 'N/A';
    };

    // Get beneficiary address
    const getBeneficiaryAddress = () => {
        const addr = details.beneficiaryAddress;
        if (!addr) return '';
        return [
            addr.street_line_1,
            addr.street_line_2,
            addr.city,
            addr.state,
            addr.postal_code,
            addr.country,
        ]
            .filter(Boolean)
            .join(', ');
    };

    return (
        <div className='flex w-full flex-col gap-4'>
            {/* Transfer Type Tabs */}
            <Tabs
                value={transferType}
                onValueChange={(v) => setTransferType(v as USDTransferType)}
            >
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='ach'>ACH</TabsTrigger>
                    <TabsTrigger value='wire'>WIRE</TabsTrigger>
                    <TabsTrigger value='swift'>SWIFT</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Account Details Header */}
            <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold'>Account Details</h3>
                <CopyAllButton
                    data={{
                        Currency: 'USD',
                        'Account Number': details.accountNumber,
                        'Routing Number': getRoutingNumber(),
                        'Account Type': 'Checking',
                        Beneficiary: getBeneficiaryName(),
                        Bank: details.bankName,
                    }}
                />
            </div>

            {/* Account Details */}
            <div className='flex w-full flex-col gap-2'>
                <EARow>
                    <EARowLabel>Currency</EARowLabel>
                    <EARowValue>
                        <CircleFlag countryCode='us' className='size-5' />
                        USD
                    </EARowValue>
                </EARow>
                <EARow>
                    <EARowLabel>Account Number</EARowLabel>
                    <EARowValue>
                        <CopyText text={details.accountNumber} />
                    </EARowValue>
                </EARow>
                <EARow>
                    <EARowLabel>
                        {transferType === 'ach' ? 'ACH Routing Number' : transferType === 'wire' ? 'WIRE Routing Number' : 'Routing Number'}
                    </EARowLabel>
                    <EARowValue>
                        <CopyText text={getRoutingNumber()} />
                    </EARowValue>
                </EARow>
                {transferType === 'swift' && (
                    <EARow>
                        <EARowLabel>SWIFT / BIC Code</EARowLabel>
                        <EARowValue>
                            <CopyText text='CITIUS33' />
                        </EARowValue>
                    </EARow>
                )}
                <EARow>
                    <EARowLabel>Account Type</EARowLabel>
                    <EARowValue>Checking</EARowValue>
                </EARow>
                <EARow>
                    <EARowLabel>Beneficiary Name & Address</EARowLabel>
                    <EARowValue className='flex-col items-start'>
                        <span>{getBeneficiaryName()}</span>
                        {getBeneficiaryAddress() && (
                            <span className='text-muted-foreground text-xs'>
                                {getBeneficiaryAddress()}
                            </span>
                        )}
                    </EARowValue>
                </EARow>
                <EARow>
                    <EARowLabel>Bank Name & Address</EARowLabel>
                    <EARowValue className='flex-col items-start'>
                        <span>{details.bankName}</span>
                        {details.bankAddress && (
                            <span className='text-muted-foreground text-xs'>
                                {details.bankAddress}
                            </span>
                        )}
                    </EARowValue>
                </EARow>
                {/* Intermediary Bank info for SWIFT */}
                {transferType === 'swift' && (
                    <>
                        <EARow>
                            <EARowLabel>Intermediary Bank</EARowLabel>
                            <EARowValue>{FEE_DATA.usd.swift.intermediaryBank}</EARowValue>
                        </EARow>
                        <EARow>
                            <EARowLabel>Intermediary SWIFT</EARowLabel>
                            <EARowValue>
                                <CopyText text={FEE_DATA.usd.swift.intermediarySwift} />
                            </EARowValue>
                        </EARow>
                    </>
                )}
            </div>

            {/* Fee & Settlement Terms */}
            <FeeSection>
                <FeeRow label='Settlement Time' value={fees.settlementTime} />
                <FeeRow label='Variable Fee' value={fees.variableFee} />
                <FeeRow label='Fixed Fee' value={fees.fixedFee} />
                <FeeRow label='Minimum Transaction' value={fees.minimumTransaction} />
            </FeeSection>
        </div>
    );
};

/** EUR Account Details with SEPA/SWIFT tabs */
const EURAccountDetails = ({
    details,
}: {
    details: DueVirtualAccountEURDetails | null | undefined;
}) => {
    const [transferType, setTransferType] = useState<EURTransferType>('sepa');
    const fees = FEE_DATA.eur[transferType];

    // Graceful handling of missing details
    if (!details) {
        return <AccountDetailsError currency='EUR' />;
    }

    // Get account holder name
    const getAccountHolderName = () => {
        if (details.accountType === 'business' && details.companyName) {
            return details.companyName;
        }
        return [details.firstName, details.lastName].filter(Boolean).join(' ') || 'N/A';
    };

    // Get beneficiary address (for display)
    const getBeneficiaryAddress = () => {
        // EUR accounts may have address info in the future
        return '';
    };

    return (
        <div className='flex w-full flex-col gap-4'>
            {/* Transfer Type Tabs */}
            <Tabs
                value={transferType}
                onValueChange={(v) => setTransferType(v as EURTransferType)}
            >
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='sepa'>SEPA</TabsTrigger>
                    <TabsTrigger value='swift'>SWIFT</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Account Details Header */}
            <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold'>Account Details</h3>
                <CopyAllButton
                    data={{
                        Currency: 'EUR',
                        IBAN: details.IBAN,
                        'SWIFT / BIC Code': details.swiftCode || 'N/A',
                        'Account Holder': getAccountHolderName(),
                        Bank: details.bankName || 'N/A',
                    }}
                />
            </div>

            {/* Account Details */}
            <div className='flex w-full flex-col gap-2'>
                <EARow>
                    <EARowLabel>Currency</EARowLabel>
                    <EARowValue>
                        <CircleFlag countryCode='eu' className='size-5' />
                        EUR
                    </EARowValue>
                </EARow>
                <EARow>
                    <EARowLabel>IBAN</EARowLabel>
                    <EARowValue>
                        <CopyText text={details.IBAN} />
                    </EARowValue>
                </EARow>
                {details.swiftCode && (
                    <EARow>
                        <EARowLabel>SWIFT / BIC Code</EARowLabel>
                        <EARowValue>
                            <CopyText text={details.swiftCode} />
                        </EARowValue>
                    </EARow>
                )}
                <EARow>
                    <EARowLabel>Beneficiary Name & Address</EARowLabel>
                    <EARowValue className='flex-col items-start'>
                        <span>{getAccountHolderName()}</span>
                        {getBeneficiaryAddress() && (
                            <span className='text-muted-foreground text-xs'>
                                {getBeneficiaryAddress()}
                            </span>
                        )}
                    </EARowValue>
                </EARow>
                {details.bankName && (
                    <EARow>
                        <EARowLabel>Bank Name & Address</EARowLabel>
                        <EARowValue>{details.bankName}</EARowValue>
                    </EARow>
                )}

                {/* Intermediary Bank info for SWIFT */}
                {transferType === 'swift' && (
                    <>
                        <EARow>
                            <EARowLabel>Intermediary Bank</EARowLabel>
                            <EARowValue>{FEE_DATA.eur.swift.intermediaryBank}</EARowValue>
                        </EARow>
                        <EARow>
                            <EARowLabel>Intermediary SWIFT</EARowLabel>
                            <EARowValue>
                                <CopyText text={FEE_DATA.eur.swift.intermediarySwift} />
                            </EARowValue>
                        </EARow>
                    </>
                )}
            </div>

            {/* Fee & Settlement Terms */}
            <FeeSection>
                <FeeRow label='Settlement Time' value={fees.settlementTime} />
                <FeeRow label='Variable Fee' value={fees.variableFee} />
                <FeeRow label='Fixed Fee' value={fees.fixedFee} />
                <FeeRow label='Minimum Transaction' value={fees.minimumTransaction} />
            </FeeSection>
        </div>
    );
};

/** AED Account Details */
const AEDAccountDetails = ({
    details,
}: {
    details: DueVirtualAccountAEDDetails | null | undefined;
}) => {
    const fees = FEE_DATA.aed;

    // Graceful handling of missing details
    if (!details) {
        return <AccountDetailsError currency='AED' />;
    }

    // Get account holder name
    const getAccountHolderName = () => {
        if (details.accountType === 'business' && details.companyName) {
            return details.companyName;
        }
        return [details.firstName, details.lastName].filter(Boolean).join(' ') || 'N/A';
    };

    // Get beneficiary address
    const getBeneficiaryAddress = () => {
        const addr = details.beneficiaryAddress;
        if (!addr) return '';
        return [
            addr.street_line_1,
            addr.street_line_2,
            addr.city,
            addr.state,
            addr.postal_code,
            addr.country,
        ]
            .filter(Boolean)
            .join(', ');
    };

    return (
        <div className='flex w-full flex-col gap-4'>
            {/* Account Details Header */}
            <div className='flex items-center justify-between'>
                <h3 className='text-sm font-semibold'>Account Details</h3>
                <CopyAllButton
                    data={{
                        Currency: 'AED',
                        IBAN: details.IBAN,
                        'SWIFT Code': details.swiftCode || 'N/A',
                        'Account Holder': getAccountHolderName(),
                        Bank: details.bankName || 'N/A',
                    }}
                />
            </div>

            {/* Account Details */}
            <div className='flex w-full flex-col gap-2'>
                <EARow>
                    <EARowLabel>Currency</EARowLabel>
                    <EARowValue>
                        <CircleFlag countryCode='ae' className='size-5' />
                        AED
                    </EARowValue>
                </EARow>
                <EARow>
                    <EARowLabel>IBAN</EARowLabel>
                    <EARowValue>
                        <CopyText text={details.IBAN} />
                    </EARowValue>
                </EARow>
                {details.swiftCode && (
                    <EARow>
                        <EARowLabel>SWIFT Code</EARowLabel>
                        <EARowValue>
                            <CopyText text={details.swiftCode} />
                        </EARowValue>
                    </EARow>
                )}
                <EARow>
                    <EARowLabel>Account Holder</EARowLabel>
                    <EARowValue className='flex-col items-start'>
                        <span>{getAccountHolderName()}</span>
                        {getBeneficiaryAddress() && (
                            <span className='text-muted-foreground text-xs'>
                                {getBeneficiaryAddress()}
                            </span>
                        )}
                    </EARowValue>
                </EARow>
                {details.bankName && (
                    <EARow>
                        <EARowLabel>Bank</EARowLabel>
                        <EARowValue>{details.bankName}</EARowValue>
                    </EARow>
                )}
            </div>

            {/* Fee & Settlement Terms */}
            <FeeSection>
                <FeeRow label='Settlement Time' value={fees.settlementTime} />
                <FeeRow label='Variable Fee' value={fees.variableFee} />
                <FeeRow label='Fixed Fee' value={fees.fixedFee} />
                <FeeRow label='Minimum Transaction' value={fees.minimumTransaction} />
            </FeeSection>
        </div>
    );
};

export const DueAccountDetails = {
    USD: USDAccountDetails,
    EUR: EURAccountDetails,
    AED: AEDAccountDetails,
};

// ============================================
// Error Component for graceful handling
// ============================================

/** Shown when account details are null/undefined */
const AccountDetailsError = ({ currency }: { currency: string }) => {
    return (
        <div className='flex w-full flex-col items-center justify-center gap-4 py-12'>
            <AlertCircle className='text-muted-foreground size-10' />
            <p className='text-muted-foreground text-center text-sm'>
                Unable to load {currency} account details.
                <br />
                Please try again later or contact support.
            </p>
        </div>
    );
};

// ============================================
// Helper Components
// ============================================

const EARow: FC<PropsWithChildren> = ({ children }) => {
    return <div className='flex gap-2'>{children}</div>;
};

const EARowLabel: FC<PropsWithChildren> = ({ children }) => {
    return (
        <span className='text-muted-foreground min-w-[40%] text-sm'>
            {children}
        </span>
    );
};

const EARowValue: FC<PropsWithChildren<{ className?: string }>> = ({
    children,
    className,
}) => {
    return (
        <span
            className={cn('flex max-w-[60%] items-center gap-1 text-sm', className)}
        >
            {children}
        </span>
    );
};

/** Copyable text with copy icon */
const CopyText = ({ text }: { text: string }) => {
    return (
        <CopyButton
            stringToCopy={text}
            className='h-fit flex-row-reverse p-0 text-sm font-normal'
            variant='link'
            copyIconClassName='text-muted-foreground'
        >
            {text}
        </CopyButton>
    );
};

/** Copy all button for header */
const CopyAllButton = ({ data }: { data: Record<string, string> }) => {
    const allText = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    return (
        <CopyButton
            stringToCopy={allText}
            variant='outline'
            size='sm'
            className='h-8 gap-1.5 text-xs'
        >
            Copy
        </CopyButton>
    );
};

/** Fee section wrapper */
const FeeSection: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className='flex flex-col gap-2 border-t pt-4'>
            <h3 className='text-sm font-semibold'>Fee & Settlement Terms</h3>
            <div className='flex flex-col gap-1'>{children}</div>
        </div>
    );
};

/** Fee row */
const FeeRow = ({ label, value }: { label: string; value: string }) => {
    return (
        <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>{label}</span>
            <span>{value}</span>
        </div>
    );
};
