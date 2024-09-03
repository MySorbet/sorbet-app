import { z } from 'zod';

// Zod schema for the app configuration
const appConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  sorbetApiUrl: z.string().url().optional().default('http://localhost:6200'),
  showLogger: z.preprocess((val) => val === 'true', z.boolean()).default(false),
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
  showLogger: process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true',
  googleMapKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
  sendbirdAppId: process.env.NEXT_PUBLIC_SEND_BIRD_APP_ID,
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
  contractAddress: process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS,
  usdcAddress: process.env.NEXT_PUBLIC_BASE_USDC_ADDRESS,
});
