/* eslint-disable max-len */
import pickBy from 'lodash.pickby';

const windowEnv = typeof window !== 'undefined' ? pickBy((window as unknown as {env: any}).env || {}, (v) => !!v) : {};

const environment = {
  DEBUG:                                windowEnv.DEBUG || process.env.NEXT_PUBLIC_DEBUG,
  REACT_APP_BASE_PATH:                  windowEnv.REACT_APP_BASE_PATH || process.env.NEXT_PUBLIC_REACT_APP_BASE_PATH,
  NETWORK_ID:                           windowEnv.NETWORK_ID || process.env.NEXT_PUBLIC_NETWORK_ID,
  RELAYER_URL:                          windowEnv.RELAYER_URL || process.env.NEXT_PUBLIC_RELAYER_URL,
  FIREBASE_API_KEY:                     windowEnv.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN:                 windowEnv.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID:                  windowEnv.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET:              windowEnv.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID:         windowEnv.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID:                      windowEnv.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID:              windowEnv.FIREBASE_MEASUREMENT_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  RELAYER_URL_TESTNET:                  windowEnv.RELAYER_URL_TESTNET || process.env.NEXT_PUBLIC_RELAYER_URL_TESTNET,
  FIREBASE_API_KEY_TESTNET:             windowEnv.FIREBASE_API_KEY_TESTNET || process.env.NEXT_PUBLIC_FIREBASE_API_KEY_TESTNET,
  FIREBASE_AUTH_DOMAIN_TESTNET:         windowEnv.FIREBASE_AUTH_DOMAIN_TESTNET || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_TESTNET,
  FIREBASE_PROJECT_ID_TESTNET:          windowEnv.FIREBASE_PROJECT_ID_TESTNET || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_TESTNET,
  FIREBASE_STORAGE_BUCKET_TESTNET:      windowEnv.FIREBASE_STORAGE_BUCKET_TESTNET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_TESTNET,
  FIREBASE_MESSAGING_SENDER_ID_TESTNET: windowEnv.FIREBASE_MESSAGING_SENDER_ID_TESTNET || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_TESTNET,
  FIREBASE_APP_ID_TESTNET:              windowEnv.FIREBASE_APP_ID_TESTNET || process.env.NEXT_PUBLIC_FIREBASE_APP_ID_TESTNET,
  FIREBASE_MEASUREMENT_ID_TESTNET:      windowEnv.FIREBASE_MEASUREMENT_ID_TESTNET || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_TESTNET,
  SENTRY_DSN:                           windowEnv.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  SENTRY_DSN_TESTNET:                   windowEnv.SENTRY_DSN_TESTNET || process.env.NEXT_PUBLIC_SENTRY_DSN_TESTNET,
  GIT_COMMIT_HASH:                      windowEnv.GIT_COMMIT_HASH || process.env.NEXT_PUBLIC_GIT_COMMIT_HASH,
};

export default environment;
