/**
 * Country restriction utilities for onboarding
 * Based on Bridge/banking partner restrictions for USD and EUR Virtual Accounts
 */

import { iso31661 } from 'iso-3166';

// Countries restricted from BOTH USD AND EUR
export const NO_USD_NO_EUR_COUNTRIES = [
    // Africa
    'DZA', // Algeria
    'COD', // Congo (Democratic Republic)
    'LBY', // Libya
    'MAR', // Morocco
    'MOZ', // Mozambique
    'SOM', // Somalia
    'SSD', // South Sudan
    'SDN', // Sudan
    // Asia
    'AFG', // Afghanistan
    'BGD', // Bangladesh
    'CHN', // China
    'PSE', // Palestinian Territory (Gaza Strip, West Bank)
    'IRN', // Iran
    'IRQ', // Iraq
    'LBN', // Lebanon
    'MMR', // Myanmar
    'NPL', // Nepal
    'PRK', // North Korea
    'PAK', // Pakistan
    'QAT', // Qatar
    'SYR', // Syria
    'YEM', // Yemen
    // Europe
    'BLR', // Belarus
    'MKD', // North Macedonia
    'RUS', // Russian Federation
    'UKR', // Ukraine (Crimea, Sevastopol, Donetsk, Kherson, Luhansk, Zaporizhzhia)
    // Americas
    'CUB', // Cuba
    'HTI', // Haiti
    'NIC', // Nicaragua
    'VEN', // Venezuela
];

// Countries restricted from EUR ONLY (USD available)
const NO_EUR_ONLY_COUNTRIES = [
    // Africa
    'CAF', // Central African Republic
    'EGY', // Egypt
    'TUN', // Tunisia
    // Asia
    'KWT', // Kuwait
    'VNM', // Vietnam
    // Europe
    'FIN', // Finland
    'HUN', // Hungary
    'LVA', // Latvia
    'LTU', // Lithuania
    'NLD', // Netherlands
    'SVN', // Slovenia
];

// Countries restricted from USD ONLY (EUR available)
const NO_USD_ONLY_COUNTRIES = [
    // Africa
    'BDI', // Burundi
    'GNB', // Guinea-Bissau
    'KEN', // Kenya
    'NER', // Niger
    'ZWE', // Zimbabwe
    // Asia
    'BTN', // Bhutan
    // Europe
    'XKX', // Kosovo
];

export type CountryRestrictionType =
    | 'no-usd-no-eur'
    | 'no-eur-only'
    | 'no-usd-only'
    | 'no-restriction';

export interface CountryRestrictionInfo {
    type: CountryRestrictionType;
    message: string | null;
}

/**
 * Get the restriction info for a country based on its alpha3 code
 */
export function getCountryRestriction(alpha3: string): CountryRestrictionInfo {
    if (NO_USD_NO_EUR_COUNTRIES.includes(alpha3)) {
        return {
            type: 'no-usd-no-eur',
            message:
                "We can't offer USD or EUR Virtual Accounts in your region. You can still use Sorbet for USDC payments.",
        };
    }

    if (NO_EUR_ONLY_COUNTRIES.includes(alpha3)) {
        return {
            type: 'no-eur-only',
            message:
                "We can't offer EUR payments at the moment, but we still can provide USD Virtual Accounts and USDC payments as well.",
        };
    }

    if (NO_USD_ONLY_COUNTRIES.includes(alpha3)) {
        return {
            type: 'no-usd-only',
            message:
                "We can't offer USD payments at the moment, but we still can provide EUR Virtual Accounts and USDC payments as well.",
        };
    }

    return {
        type: 'no-restriction',
        message: null,
    };
}

/**
 * Check if a country (by full name) is restricted from USD and EUR accounts.
 * for dashboard to show restricted banner based on user's country field.

 */
export function isRestrictedCountry(countryName?: string): boolean {
    if (!countryName) return false;

    // Find the country by name and get its alpha3 code
    const country = iso31661.find(
        (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) return false;

    return NO_USD_NO_EUR_COUNTRIES.includes(country.alpha3);
}

