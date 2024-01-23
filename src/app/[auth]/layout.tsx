'use client';

import React from 'react';

import Header from '@/components/Header/header';
import Sidebar from '@/components/sidebar';

import { useAppSelector } from '@/redux/hook';

const Layout = ({ children }: { children: React.ReactNode }) => {
  
  const user = useAppSelector((state) => state.userReducer);

  return (
    <>
      <Header />
      {children}
      <Sidebar
        openSideBar={user.toggleOpenSidebar}
        userInfo={user.user}
      />
    </>
  );
};

export default Layout;
