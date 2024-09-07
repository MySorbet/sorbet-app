import { env } from '@/lib/env';

// TODO: remove this abstraction
export const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export * from './withAuthHeader';
