'use client';

import Container from '@/app/container';
import { Sidebar } from '@/components';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { useEffect, useState } from 'react';

const Home = () => {
  const { user: authUser } = useAuth();
  const reduxUser = useAppSelector((state) => state.userReducer.user);
  const [user, setUser] = useState(authUser || reduxUser);
  const { toggleOpenSidebar } = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    setUser(authUser || reduxUser);
  }, [authUser, reduxUser]);

  return (
    <Container>
      <Header />
      {user && (
        <>
          <Sidebar show={toggleOpenSidebar} userInfo={user} />
          <Profile user={user} canEdit />
        </>
      )}
    </Container>
  );
};

export default Home;
