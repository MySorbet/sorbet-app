import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  children: any;
}

const Container: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !window.location.pathname.includes('signup')) {
      router.push('/signin');
    }
  }, [user, router]);

  return <>{children}</>;
};

export default Container;
