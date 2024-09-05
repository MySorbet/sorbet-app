import { config } from '@/lib/config';

// TODO: remove this abstraction
export const API_URL = config.sorbetApiUrl;

export * from './withAuthHeader';
