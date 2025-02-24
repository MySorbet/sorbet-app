import { ProfileForm } from './profile-form';

export const SettingsDashboard = () => {
  return (
    <div className='@container flex w-full min-w-fit max-w-5xl flex-col gap-10'>
      <div className='flex items-center justify-between gap-4'>
        <div className='text-2xl font-semibold'>Settings</div>
      </div>
        <ProfileForm />
    </div>

  );
}; 