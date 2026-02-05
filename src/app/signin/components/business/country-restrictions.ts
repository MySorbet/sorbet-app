/**
 * Country restriction utilities for onboarding
 * Based on Due compliance restrictions for Virtual Accounts
 */

import { iso31661 } from 'iso-3166';

/**
 * Countries restricted from Virtual Accounts due to Due compliance requirements
 * Note: UKR includes disputed/occupied territories (Crimea, Donetsk, Luhansk, and other parts of Eastern Ukraine)
 */
export const RESTRICTED_COUNTRIES = [
    // Africa
    'CAF', // Central African Republic
    'COD', // DR Congo
    'ERI', // Eritrea
    'GNB', // Guinea-Bissau
    'LBY', // Libya
    'MLI', // Mali
    'SOM', // Somalia
    'SSD', // South Sudan
    'SDN', // Sudan
    'ZWE', // Zimbabwe
    // Asia
    'CHN', // China
    'IRN', // Iran
    'IRQ', // Iraq
    'LBN', // Lebanon
    'PRK', // North Korea
    'SYR', // Syria
    'YEM', // Yemen
    // Europe
    'BLR', // Belarus
    'RUS', // Russian Federation
    'UKR', // Ukraine (disputed territories: Donbas, Donetsk, Luhansk, Crimea, Eastern Ukraine)
    // Americas
    'CUB', // Cuba
    'VEN', // Venezuela
];

// Kept for backwards compatibility - references the same list
export const NO_USD_NO_EUR_COUNTRIES = RESTRICTED_COUNTRIES;

export type CountryRestrictionType = 'restricted' | 'no-restriction';

export interface CountryRestrictionInfo {
    type: CountryRestrictionType;
    message: string | null;
}

/**
 * Get the restriction info for a country based on its alpha3 code
 */
export function getCountryRestriction(alpha3: string): CountryRestrictionInfo {
    if (RESTRICTED_COUNTRIES.includes(alpha3)) {
        return {
            type: 'restricted',
            message:
                "We can't offer Virtual Accounts in your region. You can still use Sorbet for USDC payments.",
        };
    }

    return {
        type: 'no-restriction',
        message: null,
    };
}

/**
 * Check if a country (by full name) is restricted from Virtual Accounts.
 * Used in dashboard to show restricted banner based on user's country field.
 */
export function isRestrictedCountry(countryName?: string): boolean {
    if (!countryName) return false;

    // Find the country by name and get its alpha3 code
    const country = iso31661.find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) return false;

    return RESTRICTED_COUNTRIES.includes(country.alpha3);
}

