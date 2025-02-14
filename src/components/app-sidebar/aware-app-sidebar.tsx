import { usePathname } from 'next/navigation';

import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { useAuth } from '@/hooks/use-auth';

/**
 * This component is used to conditionally render the AppSidebar based on the user's authentication status and the current pathname.
 * It ensures that the sidebar is only visible when the user is authenticated and not on pages we would like to be fullscreen.
 */
export const AwareAppSideBar = () => {
  const { user } = useAuth();
  const pathName = usePathname();
  const isCreateInvoice = pathName.includes('/invoices/create');
  const showSidebar = user && !isCreateInvoice;
  return showSidebar ? <AppSidebar /> : null;
};
