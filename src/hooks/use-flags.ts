import { useAuth } from '@/hooks';
import { featureFlags } from '@/lib/flags';

/** These are the users who will have access to the developer features shown below in production (when using the helper fn below) */
const DEVELOPERS = ['cutaiar'];
/** These are the users who will have access to the preview features shown below in production (when using the helper fn below) */
const PREVIEW_USERS = [
  'maherayari',
  'maher',
  'ramioc',
  'chrisa',
  ...DEVELOPERS,
];
const isDeveloper = (handle: string) => DEVELOPERS.includes(handle);
const isPreviewUser = (handle: string) => PREVIEW_USERS.includes(handle);
const isLocal = () => process.env.NODE_ENV === 'development';

/**
 * Use this hook to get access to flags which require the auth context.
 *
 * Use `featureFlags()` to get access to flags which do not require the auth context or a hook.
 */
export const useFlags = () => {
  const { user } = useAuth();
  const handle = user?.handle ?? '';
  return {
    ...featureFlags(),
    settings: isLocal() || isPreviewUser(handle),
    recipients: true,
    accounts: true,
  };
};
