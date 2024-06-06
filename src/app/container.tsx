import { Loading } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { KnockProvider, KnockFeedProvider } from '@knocklabs/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  children: any;
}

const Container: React.FC<Props> = ({ children }) => {
  const { user, accessToken, checkAuth, appLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserAndFetchDetails = async () => {
      if (!user && !window.location.pathname.includes('signup')) {
        router.push('/signin');
      } else {
        if (accessToken) {
          const user = await checkAuth();
          if (!user) {
            logout();
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
    return (
      <KnockProvider
        apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY || ''}
        userId={user.id}
      >
        {children}
      </KnockProvider>
    );
  } else {
    return <Loading />;
  }
};

export default Container;
