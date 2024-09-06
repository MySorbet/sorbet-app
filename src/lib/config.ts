import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Zod schema for the app configuration
const appConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  sorbetApiUrl: z.string().url().optional().default('http://localhost:6200'),
  googleMapKey: z.string(),
  sendbirdAppId: z.string(),
  privyAppId: z.string(),
  contractAddress: z.string(),
  usdcAddress: z.string(),
});
// Infer TS type from the Zod schema
type AppConfig = z.infer<typeof appConfigSchema>;

// Type safe parse of our environment variables into a config object
export const config: AppConfig = appConfigSchema.parse({
  nodeEnv: process.env.NEXT_PUBLIC_NODE_ENV,
  sorbetApiUrl: process.env.NEXT_PUBLIC_SORBET_API_URL,
  googleMapKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  sendbirdAppId: process.env.NEXT_PUBLIC_SEND_BIRD_APP_ID,
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  contractAddress: process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS,
  usdcAddress: process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
});

export const env = createEnv({
  client: {
    NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'production', 'test']),
    NEXT_PUBLIC_SORBET_API_URL: z.string().url(),
    NEXT_PUBLIC_GOOGLE_MAP_KEY: z.string(),
    NEXT_PUBLIC_SEND_BIRD_APP_ID: z.string(),
    NEXT_PUBLIC_PRIVY_APP_ID: z.string(),
    NEXT_PUBLIC_BASE_CONTRACT_ADDRESS: z.string(),
    NEXT_PUBLIC_BASE_USDC_ADDRESS: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    NEXT_PUBLIC_SORBET_API_URL: process.env.NEXT_PUBLIC_SORBET_API_URL,
    NEXT_PUBLIC_GOOGLE_MAP_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    NEXT_PUBLIC_SEND_BIRD_APP_ID: process.env.NEXT_PUBLIC_SEND_BIRD_APP_ID,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_BASE_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BASE_USDC_ADDRESS: process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
  },
});
