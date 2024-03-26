import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Props {
  children: any;
}

const Container: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/signin');
  }

  return <>{children}</>;
};

export default Container;
