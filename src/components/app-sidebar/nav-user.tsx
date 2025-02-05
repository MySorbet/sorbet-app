import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import { ChevronsUpDown, LogOut, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Spinner } from '@/components/common/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = async (e: Event) => {
    e.preventDefault();
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    router.replace('/signin');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-full'>
                <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                <AvatarFallback className='text-muted-foreground size-8 rounded-full'>
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {user?.firstName}
                </span>
                <span className='truncate text-xs'>{user?.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleLogout}>
                {isLoggingOut ? (
                  <Spinner
                    size='small'
                    className='animate-in fade-in zoom-in-0 mr-2'
                  />
                ) : (
                  <LogOut className='mr-2 size-4' />
                )}
                {isLoggingOut ? (
                  <span className='text-sm'>Logging out...</span>
                ) : (
                  <span className='text-sm'>Log out</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
