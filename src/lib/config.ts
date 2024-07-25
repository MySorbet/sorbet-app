import type { Network, NetworkId } from '@/types/network';
import dotenv from 'dotenv';
import { z } from 'zod';

interface AppConfig {
  nodeEnv: 'development' | 'production' | 'test';
  devApiUrl: string;
  showLogger: boolean;
  networkId: string;
  contractId: string;
  relayerUrl: string;
  authDomain: string;
  defaultProfileImage?: string;
  googleMapKey?: string;
  gcpProfileBucketName?: string;
  dribbleClientId?: string;
  dribbleClientSecret?: string;
  githubClientId?: string;
  githubClientSecret?: string;
  instagramAppSecret?: string;
  instagramClientToken?: string;
  instagramBasicDisplayAppId?: string;
  instagramBasicDisplayAppSecret?: string;
  spotifyClientId?: string;
  spotifyClientSecret?: string;
  youtubeClientId?: string;
  youtubeClientSecret?: string;
}

const appConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  devApiUrl: z.string().url().optional().default('http://localhost:6200'),
  showLogger: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  networkId: z.string().optional().default('testnet'),
  contractId: z.string().optional().default('sorbet.testnet'),
  relayerUrl: z.string().url(),
  authDomain: z.string().url(),
  googleMapKey: z.string().optional(),
  defaultProfileImage: z
    .string()
    .optional()
    .default(
      'https://storage.cloud.google.com/sorbet-profile-images/default-avatar.jpeg'
    ),
  gcpProfileBucketName: z.string().optional(),
  dribbleClientId: z.string().optional(),
  dribbleClientSecret: z.string().optional(),
  githubClientId: z.string().optional(),
  githubClientSecret: z.string().optional(),
  instagramAppSecret: z.string().optional(),
  instagramClientToken: z.string().optional(),
  instagramBasicDisplayAppId: z.string().optional(),
  instagramBasicDisplayAppSecret: z.string().optional(),
  spotifyClientId: z.string().optional(),
  spotifyClientSecret: z.string().optional(),
  youtubeClientId: z.string().optional(),
  youtubeClientSecret: z.string().optional(),
});

dotenv.config({ path: ['.env', '.env.local'] });
export const config: AppConfig = appConfigSchema.parse({
  nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
  devApiUrl: process.env.NEXT_PUBLIC_DEV_API_URL,
  showLogger: process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true',
  networkId: process.env.NEXT_PUBLIC_NETWORK_ID,
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID,
  relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  defaultProfileImage: process.env.NEXT_DEFAULT_PROFILE_IMAGE,
  googleMapKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  gcpProfileBucketName: process.env.NEXT_PUBLIC_GCP_PROFILE_BUCKET_NAME,
  dribbleClientId: process.env.NEXT_PUBLIC_DRIBBLE_CLIENT_ID,
  dribbleClientSecret: process.env.NEXT_PUBLIC_DRIBBLE_CLIENT_SECRET,
  githubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  githubClientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
  instagramAppSecret: process.env.NEXT_PUBLIC_INSTAGRAM_APP_SECRET,
  instagramClientToken: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_TOKEN,
  instagramBasicDisplayAppId:
    process.env.NEXT_PUBLIC_INSTAGRAM_BASIC_DISPLAY_APP_ID,
  instagramBasicDisplayAppSecret:
    process.env.NEXT_PUBLIC_INSTAGRAM_BASIC_DISPLAY_APP_SECRET,
  spotifyClientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  youtubeClientId: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
  youtubeClientSecret: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET,
});

export const networks: Record<NetworkId, Network> = {
  mainnet: {
    networkId: 'mainnet',
    viewAccountId: 'near',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    fastAuth: {
      mpcRecoveryUrl:
        'https://mpc-recovery-leader-mainnet-cg7nolnlpa-ue.a.run.app',
      authHelperUrl: 'https://api.kitwallet.app',
      accountIdSuffix: 'near',
      firebase: {
        apiKey: 'AIzaSyDhxTQVeoWdnbpYTocBAABbLULGf6H5khQ',
        authDomain: 'near-fastauth-prod.firebaseapp.com',
        projectId: 'near-fastauth-prod',
        storageBucket: 'near-fastauth-prod.appspot.com',
        messagingSenderId: '829449955812',
        appId: '1:829449955812:web:532436aa35572be60abff1',
        measurementId: 'G-T2PPJ8QRYY',
      },
    },
  },
  testnet: {
    networkId: 'testnet',
    viewAccountId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    fastAuth: {
      mpcRecoveryUrl: 'https://mpc-recovery-7tk2cmmtcq-ue.a.run.app',
      authHelperUrl: 'https://testnet-api.kitwallet.app',
      accountIdSuffix: 'testnet',
      firebase: {
        apiKey: 'AIzaSyCmD88ExxK3vc7p3qkMvgFfdkyrWa2w2dg',
        authDomain: 'my-fastauth-issuer-ea4c0.firebaseapp.com',
        projectId: 'my-fastauth-issuer-ea4c0',
        storageBucket: 'my-fastauth-issuer-ea4c0.appspot.com',
        messagingSenderId: '505357561486',
        appId: '1:505357561486:web:81b6f1a273d8ccd20da3df',
        measurementId: 'G-HF2NBGE60S',
      },
    },
  },
};

export const CONSTANTS = {
  SendbirdAppId: process.env.NEXT_PUBLIC_SEND_BIRD_APP_ID,
};

export const currentNetwork = networks[config.networkId as NetworkId];
