import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'preview', 'staging', 'production']),
    NEXT_PUBLIC_SORBET_API_URL: z.string().url(),
    NEXT_PUBLIC_DUE_BASE_URL: z.string().url(),
    NEXT_PUBLIC_GOOGLE_MAP_KEY: z.string(),
    NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY: z.string(),
    NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID: z.string(),
    NEXT_PUBLIC_PRIVY_APP_ID: z.string(),
    NEXT_PUBLIC_TESTNET: z.preprocess((val) => val === 'true', z.boolean()),
    NEXT_PUBLIC_BASE_CONTRACT_ADDRESS: z.string(),
    NEXT_PUBLIC_BASE_USDC_ADDRESS: z.string(),
    NEXT_PUBLIC_BASE_EXPLORER: z.string().url(),
    NEXT_PUBLIC_BASE_RPC_URL: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_PUBLIC_SORBET_API_URL: process.env.NEXT_PUBLIC_SORBET_API_URL,
    NEXT_PUBLIC_DUE_BASE_URL: process.env.NEXT_PUBLIC_DUE_BASE_URL,
    NEXT_PUBLIC_GOOGLE_MAP_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY:
      process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY,
    NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID:
      process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_TESTNET: process.env.NEXT_PUBLIC_TESTNET,
    NEXT_PUBLIC_BASE_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BASE_USDC_ADDRESS: process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
    NEXT_PUBLIC_BASE_EXPLORER: process.env.NEXT_PUBLIC_BASE_EXPLORER,
    NEXT_PUBLIC_BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  // Why? https://env.t3.gg/docs/customization#treat-empty-strings-as-undefined
  emptyStringAsUndefined: true,
});
