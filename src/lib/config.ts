import dotenv from 'dotenv';
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_DEV_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SHOW_LOGGER: z.string().optional(),
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
