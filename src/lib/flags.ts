type FeatureFlags = {
  [feature: string]: boolean;
};

/**
 * Use these flags to toggle on and off features in the app.
 */
export const featureFlags: FeatureFlags = {
  gigs: false, // Disable gigs as of 10/29/24 as we are not focusing on escrow
  walletAddressInSidebar: false, // Temporarily hiding as per request from Rami for demo 9/24/24
  sessionReplay: process.env.NODE_ENV === 'production',
  invoices: false,
};
