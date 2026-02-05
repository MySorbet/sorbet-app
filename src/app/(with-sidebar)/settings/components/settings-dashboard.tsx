'use client';

import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks';

import { useAccountForm } from '../hooks/use-account-form';
import { useAvatarUpload } from '../hooks/use-avatar-upload';
import { useProfileForm } from '../hooks/use-profile-form';
import { AccountTab } from './account-tab';
import { ProfileTab } from './profile-tab';
import { UnsavedChangesBanner } from './shared';

export const SettingsDashboard = () => {
  const { user } = useAuth();
  const profileForm = useProfileForm();
  const accountForm = useAccountForm();
  const { handleAvatarChange, isUploading } = useAvatarUpload();

  // Determine if either form has unsaved changes
  const hasUnsavedChanges = profileForm.isDirty || accountForm.isDirty;

  // Get user initials for avatar fallback
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.handle?.[0]?.toUpperCase() || '?';

  return (
    <div className='w-full' style={{ maxWidth: '1100px' }}>
      {hasUnsavedChanges && (
        <UnsavedChangesBanner
          onCancel={() => {
            profileForm.handleCancel();
            accountForm.handleCancel();
          }}
          onSave={() => {
            if (profileForm.isDirty) {
              profileForm.form.handleSubmit(profileForm.onSubmit)();
            }
            if (accountForm.isDirty) {
              accountForm.form.handleSubmit(accountForm.onSubmit)();
            }
          }}
          isSaving={profileForm.isUpdating || accountForm.isUpdating}
        />
      )}

      <Tabs defaultValue='account' className='@container w-full'>
        <TabsList className='@md:w-auto w-full justify-between'>
          <TabsTrigger value='account' className='flex-1'>
            Account
          </TabsTrigger>
          <TabsTrigger value='profile' className='flex-1'>
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value='account'>
          <Form {...accountForm.form}>
            <form
              onSubmit={accountForm.form.handleSubmit(accountForm.onSubmit)}
            >
              <AccountTab />
            </form>
          </Form>
        </TabsContent>

        <TabsContent value='profile'>
          <Form {...profileForm.form}>
            <form
              onSubmit={profileForm.form.handleSubmit(profileForm.onSubmit)}
            >
              <ProfileTab
                currentAvatar={user?.profileImage}
                initials={initials}
                onAvatarChange={handleAvatarChange}
                isUploadingAvatar={isUploading}
              />
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
