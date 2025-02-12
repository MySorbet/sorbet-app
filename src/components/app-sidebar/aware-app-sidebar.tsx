import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { useAuth } from '@/hooks/use-auth';

export const AwareAppSideBar = () => {
  const { user } = useAuth();
  return user ? <AppSidebar /> : null;
};
