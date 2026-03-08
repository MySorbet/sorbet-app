import type { Meta, StoryObj } from '@storybook/react';

import type { DueFeeStructure } from '@/api/due/due';
import type { DueVirtualAccountUSDetails } from '@/types/due';

import { DueAccountDetails } from './due-account-details';

// ── Shared mock fee structures ────────────────────────────────────────
const baseFee: DueFeeStructure = {
    paymentMethod: 'usd_ach',
    rail: 'ach',
    currencyCode: 'USD',
    channelType: 'static_deposit',
    accountType: 'individual',
    dueFeeBps: 50,
    dueFixedFee: '0.25',
    sorbetFeeBps: 25,
    sorbetFixedFee: '0.10',
    totalFeeBps: 75,
    totalFixedFee: '0.35',
    duePurposeRequired: false,
    speed: '1-2 business days',
    limitMin: '10.00',
    limitMax: '50000.00',
    syncedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const mockFeeStructures: DueFeeStructure[] = [
    baseFee,
    { ...baseFee, paymentMethod: 'usd_wire', rail: 'wire', speed: 'Same day', limitMin: '100.00', limitMax: '250000.00' },
    { ...baseFee, paymentMethod: 'usd_swift', rail: 'swift', speed: '2-5 business days', limitMin: '50.00', limitMax: '100000.00' },
    { ...baseFee, paymentMethod: 'eur_sepa', rail: 'sepa', currencyCode: 'EUR', speed: '1-2 business days', limitMin: '5.00', limitMax: '0' },
    { ...baseFee, paymentMethod: 'eur_swift', rail: 'swift', currencyCode: 'EUR', speed: '2-5 business days', limitMin: '50.00', limitMax: null },
    { ...baseFee, paymentMethod: 'aed_local', rail: 'mena_local', currencyCode: 'AED', speed: '1 business day', limitMin: '100.00', limitMax: '500000.00' },
];

// ── USD Stories ───────────────────────────────────────────────────────

const mockUSDDetails: DueVirtualAccountUSDetails = {
    accountType: 'individual',
    firstName: 'John',
    lastName: 'Doe',
    accountNumber: '1234567890',
    routingNumber: '021000021',
    routingNumberACH: '021000021',
    routingNumberWire: '021000089',
    bankName: 'Wells Fargo',
    bankAddress: '420 Montgomery St, San Francisco, CA',
    beneficiaryAddress: {
        street_line_1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94105',
        country: 'US',
    },
};

const usdMeta = {
    title: 'Accounts/DueAccountDetails/USD',
    component: DueAccountDetails.USD,
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className='w-[420px]'>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DueAccountDetails.USD>;

export default usdMeta;
type USDStory = StoryObj<typeof usdMeta>;

export const Default: USDStory = {
    args: {
        details: mockUSDDetails,
        feeStructures: mockFeeStructures,
    },
};

/** limitMax is null or '0' — Maximum Transaction row should not appear */
export const WithoutMaximumTransaction: USDStory = {
    args: {
        details: mockUSDDetails,
        feeStructures: mockFeeStructures.map((f) =>
            f.paymentMethod.startsWith('usd')
                ? { ...f, limitMax: null }
                : f
        ),
    },
};

/** When details are not available */
export const MissingDetails: USDStory = {
    args: {
        details: null,
        feeStructures: mockFeeStructures,
    },
};

/** limitMax is '0.00' (zero-ish) — Maximum Transaction row should not appear */
export const ZeroishMaximumHidden: USDStory = {
    args: {
        details: mockUSDDetails,
        feeStructures: mockFeeStructures.map((f) =>
            f.paymentMethod.startsWith('usd')
                ? { ...f, limitMax: '0.00' }
                : f
        ),
    },
};
