/**
 * Use these flags to toggle on and off features in the app.
 *
 * Use `useFlags` hook to get access to flags which require the auth context.
 */
export const featureFlags = () => {
  return {
    sessionReplay: process.env.NODE_ENV === 'production',
    coinGeckoApi: process.env.NODE_ENV === 'production', // Api for getting exchange rates to USD. Enabling only for production.
    skipAuthHeader: false,
  } as const;
};
