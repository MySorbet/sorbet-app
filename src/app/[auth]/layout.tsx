'use client';

import { Header } from '@/components/header/header';
import Sidebar from '@/components/sidebar';
import { useAppSelector } from '@/redux/hook';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state) => state.userReducer);

  return (
    <>
      <Header />
      {children}
      <Sidebar openSideBar={user.toggleOpenSidebar} userInfo={user.user} />
    </>
  );
};

export default Layout;
