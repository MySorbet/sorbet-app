import { checkHandleIsAvailable } from '@/api/auth';

// TODO: debounce so that not too many requests are made when typing
export const refine = async (handle: string, initialHandle: string) => {
  if (handle === initialHandle) return true; // initial handle generated for this user is allowed
  if (handle.length === 0) return false;
  const res = await checkHandleIsAvailable(handle);
  return res.data.isUnique;
};
