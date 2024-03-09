import dotenv from 'dotenv';
import { z } from 'zod';
import type { Network, NetworkId } from '@/types/network';

const envSchema = z.object({
  NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_DEV_API_URL: z.string().url().optional().default('http://localhost:6200'),
  NEXT_PUBLIC_SHOW_LOGGER: z.string().optional(),
  NEXT_PUBLIC_NETWORK_ID: z.string().optional().default('testnet'),
  NEXT_PUBLIC_CONTRACT_ID: z.string().optional().default('sorbet.testnet'),
  NEXT_PUBLIC_GOOGLE_MAP_KEY: z.string().optional(),
  NEXT_PUBLIC_GCP_PROFILE_BUCKET_NAME: z.string().optional(),
  NEXT_PUBLIC_DRIBBLE_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_DRIBBLE_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_GITHUB_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_GITHUB_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_INSTAGRAM_APP_SECRET: z.string().optional(),
  NEXT_PUBLIC_INSTAGRAM_CLIENT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_INSTAGRAM_BASIC_DISPLAY_APP_ID: z.string().optional(),
  NEXT_PUBLIC_INSTAGRAM_BASIC_DISPLAY_APP_SECRET: z.string().optional(),
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET: z.string().optional(),
  NEXT_PUBLIC_YOUTUBE_CLIENT_ID: z.string().optional(),
  NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET: z.string().optional(),
});

dotenv.config({ path: ['.env', '.env.local'] });
const parsedEnv = envSchema.parse(process.env);

export const config = {
  nodeEnv: parsedEnv.NEXT_PUBLIC_NODE_ENV,
  devApiUrl: parsedEnv.NEXT_PUBLIC_DEV_API_URL,
  showLogger: parsedEnv.NEXT_PUBLIC_SHOW_LOGGER === 'true',
  networkId: parsedEnv.NEXT_PUBLIC_NETWORK_ID,
  contractId: parsedEnv.NEXT_PUBLIC_CONTRACT_ID,
  googleMapKey: parsedEnv.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  gcpProfileBucketName: parsedEnv.NEXT_PUBLIC_GCP_PROFILE_BUCKET_NAME,
  dribbleClientId: parsedEnv.NEXT_PUBLIC_DRIBBLE_CLIENT_ID,
  dribbleClientSecret: parsedEnv.NEXT_PUBLIC_DRIBBLE_CLIENT_SECRET,
  githubClientId: parsedEnv.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  githubClientSecret: parsedEnv.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
  instagramAppSecret: parsedEnv.NEXT_PUBLIC_INSTAGRAM_APP_SECRET,
  instagramClientToken: parsedEnv.NEXT_PUBLIC_INSTAGRAM_CLIENT_TOKEN,
  instagramBasicDisplayAppId: parsedEnv.NEXT_PUBLIC_INSTAGRAM_BASIC_DISPLAY_APP_ID,
  instagramBasicDisplayAppSecret: parsedEnv.NEXT_PUBLIC_INSTAGRAM_BASIC_DISPLAY_APP_SECRET,
  spotifyClientId: parsedEnv.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  spotifyClientSecret: parsedEnv.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  youtubeClientId: parsedEnv.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
  youtubeClientSecret: parsedEnv.NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET
};

export const networks: Record<NetworkId, Network> = {
  mainnet: {
    networkId: 'mainnet',
    viewAccountId: 'near',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    fastAuth: {
      mpcRecoveryUrl: 'https://mpc-recovery-leader-mainnet-cg7nolnlpa-ue.a.run.app',
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
        apiKey: "AIzaSyCmD88ExxK3vc7p3qkMvgFfdkyrWa2w2dg",
        authDomain: "my-fastauth-issuer-ea4c0.firebaseapp.com",
        projectId: "my-fastauth-issuer-ea4c0",
        storageBucket: "my-fastauth-issuer-ea4c0.appspot.com",
        messagingSenderId: "505357561486",
        appId: "1:505357561486:web:81b6f1a273d8ccd20da3df",
        measurementId: 'G-HF2NBGE60S',
      },
    },
  }
};

export const currentNetwork = networks[config.networkId as NetworkId];
