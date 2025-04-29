import { AccountLinking } from './account-linking';
import { ExportWallet } from './export-wallet';
import { ProfileForm } from './profile-form';

export const SettingsDashboard = () => {
  return (
    <div className='@container flex w-full min-w-fit max-w-5xl flex-col gap-10'>
      <div className='text-2xl font-semibold'>Settings</div>
      <ProfileForm />
      <AccountLinking />
      <ExportWallet />
    </div>
  );
};
