/**
 * Use these flags to toggle on and off features in the app.
 */
export const featureFlags = {
  hireMe: false, // Disable hire me on profiles since we no longer have gigs
  walletAddressInSidebar: false, // Temporarily hiding as per request from Rami for demo 9/24/24
  sessionReplay: process.env.NODE_ENV === 'production',
  invoices: true,
  coinGeckoApi: process.env.NODE_ENV === 'production', // Api for getting exchange rates to USD. Enabling only for production.
  verification: true,
  sectionTitles: true,
  dashboard: true,
  // skipAuthHeader: process.env.NODE_ENV === 'development', // Skip sending the auth header in dev
  skipAuthHeader: false,
} as const;
