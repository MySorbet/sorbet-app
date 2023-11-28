import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { getMyContactsAsync } from '@/api/contract';
import { getUserFromUserId } from '@/api/user';
import { LOCAL_KEY, ROLE_KEY } from '@/constant/constant';
import { setMyContracts, setSocket } from '@/redux/contractSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setRole, updateUserData } from '@/redux/userSlice';
import { API_URL } from '@/utils';

interface Props {
  children: any;
}

const Container: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const socket = useAppSelector((state) => state.contractReducer.socket);
  const user = useAppSelector((state) => state.userReducer.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = useAppSelector((state) => state.userReducer.role);

  const localUser = localStorage.getItem(LOCAL_KEY);
  const localRole = localStorage.getItem(ROLE_KEY) ?? 'freelancer';

  useEffect(() => {
    const loadUser = async () => {
      if (localUser && localRole) {
        const res = await getUserFromUserId(JSON.parse(localUser).id);
        dispatch(updateUserData(res.data));
        dispatch(setRole(localRole));
      } else {
        router.push('/signin');
      }
    };
    loadUser();
  }, [localUser, localRole]);

  useEffect(() => {
    const sk = io(API_URL);
    dispatch(setSocket(sk));

    // return () => {
    //   sk.disconnect();
    // };
  }, []);

  useEffect(() => {
    if (socket && user?.id) {
      socket.on('milestoneChanged', async (data: any) => {
        if ((user?.id, role)) {
          const res = await getMyContactsAsync(user?.id, role);
          dispatch(setMyContracts(res.data));
        }
      });

      socket.emit('newUser', user?.id);
    }
  }, [socket, user, role]);

  return <>{children}</>;
};

export default Container;
