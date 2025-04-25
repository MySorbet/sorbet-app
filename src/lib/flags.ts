/**
 * Use these flags to toggle on and off features in the app.
 */
export const featureFlags = {
  hireMe: false, // Disable hire me on profiles since we no longer have gigs
  sessionReplay: process.env.NODE_ENV === 'production',
  coinGeckoApi: process.env.NODE_ENV === 'production', // Api for getting exchange rates to USD. Enabling only for production.
  sectionTitles: true,
  skipAuthHeader: false,
  settings: !(process.env.NODE_ENV === 'production'),
  transfers: false,
} as const;
