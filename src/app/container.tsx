import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getUserFromUserId } from '@/api/user';
import { LOCAL_KEY } from '@/constant/constant';
import { useAppDispatch } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';

interface Props {
  children: any;
}
const Container: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const value = localStorage.getItem(LOCAL_KEY);
    console.log('fetching ', value);

    if (value) {
      const res = await getUserFromUserId(JSON.parse(value).id);
      dispatch(updateUserData(res.data));
    } else {
      router.push('/signin');
    }
  };

  return <>{children}</>;
};

export default Container;
