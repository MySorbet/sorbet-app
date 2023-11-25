/* eslint-disable @next/next/no-img-element */
'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import UserHeader from '@/components/Header/userHeader';
import ChatModal from '@/components/modal/chatModal';

import { getMyContactsAsync } from '@/api/contract';
import {
  setCurrentContractID,
  setModalStatus,
  setMyContracts,
} from '@/redux/contractSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';

const Gigs = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.userReducer.user);
  const myContracts = useAppSelector(
    (state) => state.contractReducer.contracts
  );
  const role = useAppSelector((state) => state.userReducer.role);
  const modalStatus = useAppSelector(
    (state) => state.contractReducer.modalStatus
  );

  const socket = useAppSelector((state) => state.contractReducer.socket);
  const [enableSending, setEnalbeSending] = useState(true);

  useEffect(() => {
    const getMyContract = async () => {
      if (currentUser?.id) {
        const res = await getMyContactsAsync(currentUser?.id, role);
        dispatch(setMyContracts(res.data));
      }
    };
    getMyContract();
  }, [currentUser]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const toggleChat = (id: string) => {
    const contractId = searchParams.get('contractId');
    if (!contractId) {
      router.push(pathname + '?' + createQueryString('contractId', id));
    }
    dispatch(setCurrentContractID(id));
    dispatch(setModalStatus(true));
  };

  useEffect(() => {
    const contractId = searchParams.get('contractId');
    if (contractId) {
      dispatch(setCurrentContractID(contractId));
      dispatch(setModalStatus(true));

      const myContract = myContracts?.find(
        (contract) => contract.id == contractId
      );

      if (socket && myContracts && myContract && enableSending) {
        socket.emit('milestoneChanged', {
          senderId: currentUser.id,
          receiverId:
            currentUser.id == myContract?.clientId
              ? myContract.freelancerId
              : myContract.clientId,
          type: 'Event',
        });
        setEnalbeSending(false);
      }
    }
  }, [myContracts, searchParams]);

  return (
    <>
      <div className='relative z-10'>
        <div
          className={`h-screen w-full items-center justify-center bg-[#F2F2F2] ${
            modalStatus && 'bg-[#F2F2F2E5] opacity-40'
          }`}
        >
          <UserHeader />
          <div className='container m-auto flex grid h-1/2 h-[calc(100vh-68px)] columns-2 grid-cols-3 items-start justify-center gap-6 p-2.5 pl-6 pr-10 pt-[127px] max-md:grid-cols-2 max-sm:grid-cols-1'>
            <div className='self-strech flex h-full w-full flex-col items-start gap-4 rounded-lg bg-[white] px-4 pb-4 pt-2'>
              <div className='flex w-full items-center justify-between'>
                <div className='text-sm font-normal'>
                  {role == 'client' ? 'Sent' : 'Offer'}
                </div>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200'>
                  {myContracts?.length ?? 0}
                </div>
              </div>
              {myContracts &&
                myContracts?.map((contract, index) => (
                  <div
                    className='flex w-full cursor-pointer flex-col gap-2 rounded-lg rounded-lg bg-[#FAFAFA] p-4 hover:opacity-40'
                    onClick={() => toggleChat(contract.id)}
                    key={index}
                  >
                    <div className='flex w-full items-center justify-start gap-2'>
                      {role == 'freelancer' ? (
                        contract.client?.profileImage ? (
                          <img
                            src={contract.client?.profileImage}
                            alt='avatar'
                            className='h-8 w-8 rounded-full'
                          />
                        ) : (
                          <img
                            src='/avatar.svg'
                            alt='avatar'
                            className='h-8 w-8 rounded-full'
                          />
                        )
                      ) : contract.freelancer?.profileImage ? (
                        <img
                          src={contract.freelancer?.profileImage}
                          alt='avatar'
                          className='h-8 w-8 rounded-full'
                        />
                      ) : (
                        <img
                          src='/avatar.svg'
                          alt='avatar'
                          className='h-8 w-8 rounded-full'
                        />
                      )}
                      <p className='text-xs'>
                        {role == 'client'
                          ? contract?.freelancer?.firstName
                          : contract?.client?.firstName}
                      </p>
                    </div>
                    <div className='gap-0.75 flex w-full flex-col'>
                      <div className='text-sm font-normal font-semibold'>
                        {contract?.jobTitle}
                      </div>
                      <div className='text-xs font-normal'>
                        {contract?.jobDescription}
                      </div>
                    </div>
                    <div className='flex w-fit items-center justify-center rounded-full bg-yellow-400 px-3 py-1.5 text-[10px] font-semibold leading-tight text-yellow-800'>
                      Pending
                    </div>
                  </div>
                ))}
            </div>

            <div className='self-strech flex h-full w-full flex-col items-start gap-4 rounded-lg bg-[white] px-4 pb-4 pt-2'>
              <div className='flex w-full items-center justify-between'>
                <div className='text-sm font-normal'>In-progress</div>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200'>
                  0
                </div>
              </div>
            </div>
            <div className='self-strech flex h-full w-full flex-col items-start gap-4 rounded-lg bg-[white] px-4 pb-4 pt-2'>
              <div className='flex w-full items-center justify-between'>
                <div className='text-sm font-normal'>Completed</div>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200'>
                  0
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`fixed z-10 w-screen overflow-y-auto ${
            modalStatus && 'inset-0'
          }`}
        >
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <ChatModal
            // myContract={myContract}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Gigs;
