type FeatureFlags = {
  [feature: string]: boolean;
};

export const featureFlags: FeatureFlags = {
  gigs: false,
  sessionReplay: process.env.NODE_ENV === 'production',
};
