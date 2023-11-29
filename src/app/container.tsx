import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { useWalletSelector } from '@/components/commons/near-wallet/walletSelectorContext';

import { getUserFromUserId } from '@/api/user';
import { LOCAL_KEY, ROLE_KEY } from '@/constant/constant';
import { getProducts } from '@/customFunctions/getProducts';
import { setMyContracts, setSocket } from '@/redux/contractSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setRole, updateUserData } from '@/redux/userSlice';
import { API_URL } from '@/utils';
import { ContractType } from '@/types';

interface Props {
  children: any;
}

const Container: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { selector } = useWalletSelector();
  const socket = useAppSelector((state) => state.contractReducer.socket);
  const user = useAppSelector((state) => state.userReducer.user);
  const router = useRouter();
  const role = useAppSelector((state) => state.userReducer.role);

  const localUser = localStorage.getItem(LOCAL_KEY);
  const localRole = localStorage.getItem(ROLE_KEY) ?? 'freelancer';
  let result: ContractType[] = [];
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
  }, []);

  useEffect(() => {
    if (socket && user?.id) {
      socket.on('milestoneChanged', async (data: any) => {
        result = await getProducts(user, role, selector);
        dispatch(setMyContracts(result));
      });

      socket.emit('newUser', user?.id);
    }
  }, [socket, user, role]);

  return <>{children}</>;
};

export default Container;
