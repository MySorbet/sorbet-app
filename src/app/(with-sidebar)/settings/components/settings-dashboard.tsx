import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AccountLinking } from './account-linking';
import { ExportWallet } from './export-wallet';
import { ProfileForm } from './profile-form';

export const SettingsDashboard = () => {
  return (
    <Tabs defaultValue='account' className='@container w-full max-w-7xl'>
      <TabsList className='@md:w-auto w-full justify-between'>
        <TabsTrigger value='account' className='flex-1'>
          Account
        </TabsTrigger>
        <TabsTrigger value='profile' className='flex-1'>
          Profile
        </TabsTrigger>
        <TabsTrigger value='security' disabled className='flex-1'>
          Security
        </TabsTrigger>
      </TabsList>
      <TabsContent value='profile'>
        <TabContainer>
          <ProfileForm />
        </TabContainer>
      </TabsContent>
      <TabsContent value='account'>
        <TabContainer>
          <ExportWallet />
          <AccountLinking />
        </TabContainer>
      </TabsContent>
      <TabsContent value='security'></TabsContent>
    </Tabs>
  );
};

const TabContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex w-full min-w-fit flex-col gap-10'>{children}</div>
  );
};
