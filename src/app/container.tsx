import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getUserFromUserId, getWidgetsFromUserId } from '@/api/user';
import { LOCAL_KEY } from '@/constant/constant';
import { useAppDispatch } from '@/redux/hook';
import { initwidgets } from '@/redux/profileSlice';
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
    if (value) {
      const res = await getUserFromUserId(JSON.parse(value).id);
      dispatch(updateUserData(res.data));
      const res_w = await getWidgetsFromUserId(JSON.parse(value).id);
      dispatch(initwidgets(res_w.data));
    } else {
      router.push('/signin');
    }
  };

  return <>{children}</>;
};

export default Container;
