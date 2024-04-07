import { fetchUserDetails } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  children: any;
}

const Container: React.FC<Props> = ({ children }) => {
  const { user, accessToken, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetchDetails = async () => {
      if (!user && !window.location.pathname.includes('signup')) {
        router.push('/signin');
      } else {
        if (accessToken) {
          const user = await checkAuth();
        }
      }
    };

    checkUserAndFetchDetails();
  }, [router, accessToken]);

  return <>{children}</>;
};

export default Container;
