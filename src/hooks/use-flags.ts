import { useAuth } from '@/hooks';
import { featureFlags } from '@/lib/flags';

const previewUsers = [
  'maherayari', // prod
  'ramioc', // prod
  'cutaiar', // prod
];
const isPreviewUser = (handle: string) => previewUsers.includes(handle);
const isLocal = () => process.env.NODE_ENV === 'development';

/**
 * Use this hook to get access to flags which require the auth context.
 *
 * Use `featureFlags()` to get access to flags which do not require the auth context or a hook.
 */
export const useFlags = () => {
  const { user } = useAuth();
  return {
    ...featureFlags(),
    settings: isLocal() || isPreviewUser(user?.handle ?? ''),
    transfers: isLocal() || isPreviewUser(user?.handle ?? ''),
  };
};
