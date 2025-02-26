import { usePathname } from 'next/navigation';

import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { useAuth } from '@/hooks/use-auth';

// TODO: Note: this approach is a bit of a hack.
// Perhaps we could use /handle subroutes where the sidebar
// lives in the layout effectively capturing the logic here

/**
 * This component is used to conditionally render the AppSidebar based on the user's authentication status and the current pathname.
 * It ensures that the sidebar is only visible when the user is authenticated and not on pages we would like to be fullscreen.
 */
export const AwareAppSideBar = () => {
  const { user } = useAuth();
  const pathName = usePathname();
  const isCreateInvoice = pathName.includes('/invoices/create');
  const isInvoiceIdPage = pathName.match(/^\/invoices\/[a-zA-Z0-9-]+$/); // Matches a page like /invoices/123 (guid)
  const isSignIn = pathName.includes('/signin');
  const isSplash = pathName === '/';
  const showSidebar =
    user && !isCreateInvoice && !isInvoiceIdPage && !isSignIn && !isSplash;
  return showSidebar ? <AppSidebar /> : null;
};
