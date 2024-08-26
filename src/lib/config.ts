import { z } from 'zod';

import { type Network, type NetworkId, NetworkIds } from '@/types/network';

// Zod schema for the app configuration
const appConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  sorbetApiUrl: z.string().url().optional().default('http://localhost:6200'),
  showLogger: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  networkId: z.enum(NetworkIds).optional().default('testnet'),
  contractId: z.string().optional().default('sorbet.testnet'),
  relayerUrl: z.string().url(),
  fastAuthDomain: z.string().url(),
  googleMapKey: z.string(),
  sendbirdAppId: z.string(),
});
// Infer TS type from the Zod schema
type AppConfig = z.infer<typeof appConfigSchema>;

// Type safe parse of our environment variables into a config object
export const config: AppConfig = appConfigSchema.parse({
  nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
  sorbetApiUrl: process.env.NEXT_PUBLIC_SORBET_API_URL,
  showLogger: process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true',
  networkId: process.env.NEXT_PUBLIC_NETWORK_ID,
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID,
  relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL,
  fastAuthDomain: process.env.NEXT_PUBLIC_FAST_AUTH_DOMAIN,
  googleMapKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  sendbirdAppId: process.env.NEXT_PUBLIC_SEND_BIRD_APP_ID,
});

// Networks require more information than just the networkId
export const networks: Record<NetworkId, Network> = {
  mainnet: {
    networkId: 'mainnet',
    viewAccountId: 'near',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    relayerUrl: config.relayerUrl,
    fastAuth: {
      mpcRecoveryUrl:
        'https://mpc-recovery-leader-mainnet-cg7nolnlpa-ue.a.run.app',
      authHelperUrl: 'https://api.kitwallet.app',
      accountIdSuffix: 'near',
      queryApiUrl: 'https://near-queryapi.api.pagoda.co/v1/graphql',
      firebase: {
        apiKey: 'AIzaSyDhxTQVeoWdnbpYTocBAABbLULGf6H5khQ',
        fastAuthDomain: 'near-fastauth-prod.firebaseapp.com',
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
    relayerUrl: config.relayerUrl,
    fastAuth: {
      mpcRecoveryUrl: 'https://mpc-recovery-7tk2cmmtcq-ue.a.run.app',
      authHelperUrl: 'https://testnet-api.kitwallet.app',
      accountIdSuffix: 'testnet',
      queryApiUrl: 'https://near-queryapi.api.pagoda.co/v1/graphql',
      firebase: {
        apiKey: 'AIzaSyCmD88ExxK3vc7p3qkMvgFfdkyrWa2w2dg',
        fastAuthDomain: 'my-fastauth-issuer-ea4c0.firebaseapp.com',
        projectId: 'my-fastauth-issuer-ea4c0',
        storageBucket: 'my-fastauth-issuer-ea4c0.appspot.com',
        messagingSenderId: '505357561486',
        appId: '1:505357561486:web:81b6f1a273d8ccd20da3df',
        measurementId: 'G-HF2NBGE60S',
      },
    },
  },
};

// The current network is determined by the networkId in the config after parsing the environment variables
export const networkId = config.networkId;
export const network = networks[config.networkId];
