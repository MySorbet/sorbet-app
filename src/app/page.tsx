'use client';

import { useEffect, useState } from 'react';

import Container from '@/app/container';
import { PageTitle } from '@/components/common';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';

const Home = () => {
  const { user: authUser } = useAuth();
  const reduxUser = useAppSelector((state) => state.userReducer.user);
  const [user, setUser] = useState(authUser || reduxUser);

  // TODO: Should be in global state, not props.
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    if (window.innerWidth <= 768) setIsMobile(true);
    else setIsMobile(false);
  }, [window]);

  useEffect(() => {
    setUser(authUser || reduxUser);
  }, [authUser, reduxUser]);

  return (
    <Container>
      <Header />
      <PageTitle title='Home' />
      {user && <Profile user={user} canEdit={!isMobile} />}
    </Container>
  );
};

export default Home;
