/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';

import Header from '@/components/Header/userHeader';
import ChatModal from '@/components/modal/chatModal';

const Gigs = () => {
  const [showChatModal, setShowChatModal] = useState(false);

  const toggleChatModal = () => {
    setShowChatModal(!showChatModal);
  };

  return (
    <>
      <div className='relative z-10'>
        <div
          className={`h-screen w-full items-center justify-center bg-[#F2F2F2] ${
            showChatModal && 'bg-[#F2F2F2E5] opacity-40'
          }`}
        >
          <Header />
          <div className='container m-auto flex grid h-1/2 h-[calc(100vh-68px)] columns-2 grid-cols-3 items-start justify-center gap-6 p-2.5 pl-6 pr-10 pt-[127px] max-md:grid-cols-2 max-sm:grid-cols-1'>
            <div className='self-strech flex h-full w-full flex-col items-start gap-4 rounded-lg bg-[white] px-4 pb-4 pt-2'>
              <div className='flex w-full items-center justify-between'>
                <div className='text-sm font-normal'>Offers</div>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-gray-200'>
                  1
                </div>
              </div>
              <div
                className='flex w-full cursor-pointer flex-col gap-2 rounded-lg rounded-lg bg-[#FAFAFA] p-4 hover:opacity-40'
                onClick={toggleChatModal}
              >
                <div className='flex w-full items-center justify-start gap-2'>
                  <img src='/avatar.svg' alt='avatar' width={32} height={32} />
                  <p className='text-xs'>Request User</p>
                </div>
                <div className='gap-0.75 flex w-full flex-col'>
                  <div className='text-sm font-normal font-semibold'>
                    Branding reDesign
                  </div>
                  <div className='text-xs font-normal'>
                    I need a rebrand for my startup, new logo, typography, brand
                    style guide, and asset libra...
                  </div>
                </div>
                <div className='flex w-fit items-center justify-center rounded-full bg-yellow-400 px-3 py-1.5 text-[10px] font-semibold leading-tight text-yellow-800'>
                  Pending
                </div>
              </div>
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
            showChatModal && 'inset-0'
          }`}
        >
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <ChatModal
              showChatModal={showChatModal}
              toggleChatModal={toggleChatModal}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Gigs;
