import { fetchUserDetails } from '@/api/auth';
import { Loading } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  children: any;
}

const Container: React.FC<Props> = ({ children }) => {
  const { user, accessToken, checkAuth, appLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetchDetails = async () => {
      if (!user && !window.location.pathname.includes('signup')) {
        router.push('/signin');
      } else {
        if (accessToken) {
          const user = await checkAuth();
          if (!user) {
            router.push('/signin');
          }
        } else {
          router.push('/signin');
        }
      }
    };

    checkUserAndFetchDetails();
  }, [router, accessToken]);

  if (appLoading) {
    return <Loading />;
  } else if (user && accessToken) {
    return <>{children}</>;
  } else {
    return <Loading />;
  }
};

export default Container;
