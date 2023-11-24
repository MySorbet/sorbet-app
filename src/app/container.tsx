import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { getMyContactsAsync } from '@/api/contract';
import { getUserFromUserId } from '@/api/user';
import { LOCAL_KEY } from '@/constant/constant';
import { setMyContracts, setSocket } from '@/redux/contractSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { API_URL } from '@/utils';

interface Props {
  children: any;
}
const Container: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const socket = useAppSelector((state) => state.contractReducer.socket);
  const user = useAppSelector((state) => state.userReducer.user);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const value = localStorage.getItem(LOCAL_KEY);
      if (value) {
        const res = await getUserFromUserId(JSON.parse(value).id);
        dispatch(updateUserData(res.data));
      } else {
        router.push('/signin');
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const sk = io(API_URL);
    dispatch(setSocket(sk));

    // return () => {
    //   sk.disconnect();
    // };
  }, []);

  useEffect(() => {
    if (socket && user.id) {
      socket.on('milestoneChanged', async (data: any) => {
        if (user?.id) {
          const res = await getMyContactsAsync(user?.id);
          dispatch(setMyContracts(res.data));
        }
      });

      socket.emit('newUser', user.id);
    }
  }, [socket, user]);

  return <>{children}</>;
};

export default Container;
