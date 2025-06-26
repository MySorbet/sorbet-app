import { AccountSelect } from './account-select';

/**
 * Compose account components into a page with state
 */
export const AccountsPageContent = () => {
  return (
    <div className='flex size-full max-w-7xl flex-col gap-6 lg:flex-row'>
      <AccountSelect className='w-full lg:max-w-sm' />
      <div className='bg-muted flex-1 rounded-lg'></div>
    </div>
  );
};
