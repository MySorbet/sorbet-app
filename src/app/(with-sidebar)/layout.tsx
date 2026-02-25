'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks';

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      user?.customerType &&
      (!user.firstName || !user.lastName || !user.category || !user.country)
    ) {
      router.replace('/profile-completion');
    }
  }, [user, router]);

  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
