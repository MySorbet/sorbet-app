/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import CompleteContract from '@/components/contract/completeContract';
import Milestones from '@/components/contract/milestones';
import SetMilestonesWithClient from '@/components/contract/setMilestonesWithClient';
import SetMilestonesWithUser from '@/components/contract/setMilestonesWithUser';

import { setModalStatus } from '@/redux/contractSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';

import { ProjectStatus } from '@/types';

const ChatModal = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.userReducer.role);
  const modalStatus = useAppSelector(
    (state) => state.contractReducer.modalStatus
  );
  const currentContractId = useAppSelector(
    (state) => state.contractReducer.currentContractId
  );
  const myContracts = useAppSelector(
    (state) => state.contractReducer.contracts
  );
  const myContract = myContracts?.find(
    (contract) => contract.id == currentContractId
  );
  const [status, setStatus] = useState(0);

  const changeStatus = (st: number) => {
    if (status == 2) {
      dispatch(setModalStatus(false));
      setStatus(0);
    } else {
      setStatus(st);
    }
  };

  const toggleChatModal = () => {
    router.push('/gigs');
    dispatch(setModalStatus(false));
  };

  return (
    <>
      <div
        className={`z-20 inline-flex h-[800px] w-2/3 gap-4 rounded-[20px] bg-[#F7F7F7] p-6 pt-4 text-black max-sm:h-5/6 max-sm:w-[300px] ${
          modalStatus ? 'fixed' : 'hidden'
        }`}
      >
        <div className='self-strech flex w-7/12 flex-col items-start gap-4'>
          <div className='flex items-center gap-2'>
            <div className='text-xl font-semibold leading-tight'>
              Branding redesign
            </div>
            {myContract?.status == ProjectStatus.Pending && (
              <div className='flex w-fit items-center justify-center rounded-full bg-yellow-400 px-3 py-1.5 text-[10px] font-semibold leading-tight text-yellow-800'>
                Pending
              </div>
            )}
            {myContract?.status == ProjectStatus.InProgress && (
              <div className='flex w-fit items-center justify-center rounded-full bg-[#9DFBA1] px-3 py-1.5 text-[10px] font-semibold leading-tight text-yellow-800'>
                InProgress
              </div>
            )}
            {myContract?.status == ProjectStatus.Completed && (
              <div className='flex w-fit items-center justify-center rounded-full bg-[#B4E8FF] px-3 py-1.5 text-[10px] font-semibold leading-tight text-yellow-800'>
                Completed
              </div>
            )}
          </div>
          <div className='relative flex h-full w-full flex-col gap-6 rounded-lg bg-[#F2F2F2] py-3 pl-3 pr-4'>
            <div className='self-strech flex items-start gap-2.5'>
              <img src='/avatar.svg' alt='avatar' width={32} height={32} />
              <div className='flex flex-col items-start gap-2 pt-1'>
                <div className='flex items-center gap-2 leading-3'>
                  <div className='text-xs font-semibold'>First Name</div>
                  <div className='text-xs font-normal text-[#666]'>9:55AM</div>
                </div>
                <div className='items-start gap-2.5 rounded-lg bg-[#D7D7D7] px-3 py-2 leading-6'>
                  Hello!
                </div>
                <div className='items-start gap-2.5 rounded-lg bg-[#D7D7D7] px-3 py-2 leading-6'>
                  Hello!
                </div>
                <div className='items-start gap-2.5 rounded-lg bg-[#D7D7D7] px-3 py-2 leading-6'>
                  Hello!
                </div>
              </div>
            </div>
            <div className='self-strech flex items-start gap-2.5'>
              <img src='/avatar.svg' alt='avatar' width={32} height={32} />
              <div className='flex flex-col items-start gap-2 pt-1'>
                <div className='flex items-center gap-2 leading-3'>
                  <div className='text-xs font-semibold'>First Name</div>
                  <div className='text-xs font-normal text-[#666]'>9:55AM</div>
                </div>
                <div className='bg-primary-default items-start gap-2.5 rounded-lg px-3 py-2 leading-6 text-white'>
                  Hello!
                </div>
                <p className='bg-primary-default gap-2.5 rounded-lg px-3 py-2 leading-6 text-white'>
                  Hello! My name is Chris Kally. I am web full stack develoepr.
                  I want to work with you. I am looking hearing from you.
                </p>
                <div className='bg-primary-default items-start gap-2.5 rounded-lg px-3 py-2 leading-6 text-white'>
                  Hello!
                </div>
              </div>
            </div>
            <div className='self-strech absolute bottom-3 w-[calc(100%-24px)] items-center justify-end gap-6 rounded-lg bg-white px-5 pb-2 pt-4'>
              <input
                placeholder='Type your message'
                className='w-full border-none'
              />
              <div className='flex h-8 items-center justify-between pl-4 pr-2'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <img
                      src='/svg/chat/pluscircle.svg'
                      alt='pluscircle'
                      className='cursor-pointer'
                      width={20}
                      height={20}
                    />
                    <img
                      src='/svg/chat/record.svg'
                      alt='record'
                      className='cursor-pointer'
                      width={20}
                      height={20}
                    />
                    <img
                      src='/svg/chat/emoji.svg'
                      alt='emoji'
                      className='cursor-pointer'
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className='h-[1px] w-4 rotate-90 bg-[#F2F2F2]'></div>
                  <div className='flex items-center gap-2'>
                    <img
                      src='/svg/chat/link.svg'
                      className='cursor-pointer'
                      alt='link'
                      width={20}
                      height={20}
                    />
                    <img
                      src='/svg/chat/textBold.svg'
                      className='cursor-pointer'
                      alt='textBold'
                      width={20}
                      height={20}
                    />
                    <img
                      src='/svg/chat/textItalic.svg'
                      className='cursor-pointer'
                      alt='textItalic'
                      width={20}
                      height={20}
                    />
                    <img
                      src='/svg/chat/listBullets.svg'
                      className='cursor-pointer'
                      alt='listBullets'
                      width={20}
                      height={20}
                    />
                    <img
                      src='/svg/chat/listNumbers.svg'
                      className='cursor-pointer'
                      alt='listNumbers'
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className='bg-dark flex cursor-pointer items-start gap-[10px] rounded-xl p-2 opacity-20'>
                  <img
                    src='/svg/Arrow.svg'
                    alt='Arrow'
                    width={16}
                    height={16}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='self-strech flex w-5/12 flex-col items-start gap-2'>
          <div className='flex w-full cursor-pointer justify-end'>
            <img
              src='/images/cancel.png'
              alt='close'
              width={40}
              height={40}
              onClick={toggleChatModal}
            />
          </div>
          {status == 0 && <Milestones onChangeStatus={changeStatus} />}
          {status == 1 &&
            (role == 'client' ? (
              <SetMilestonesWithClient
                onChangeContract={changeStatus}
                myContract={myContract}
              />
            ) : (
              <SetMilestonesWithUser
                onChangeContract={changeStatus}
                myContract={myContract}
              />
            ))}
          {status == 2 && (
            <CompleteContract
              contract={status}
              onChangeContract={changeStatus}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ChatModal;
