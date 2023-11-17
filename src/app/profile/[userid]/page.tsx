/* eslint-disable @next/next/no-img-element */
'use client';

// eslint-disable-next-line simple-import-sort/imports
import { useState } from 'react';

import '../profile.css';

import ProfileEditModal from '@/components/modal/profileEditModal';
import Dribble from '@/components/profile/dribble';
import Spotify from '@/components/profile/spotify';
import Instgram from '@/components/profile/instgram';
import Github from '@/components/profile/github';
import SoundCloud from '@/components/profile/soundCloud';
import Youtube from '@/components/profile/youtube';

const Profile = () => {
  const [editModal, setEditModal] = useState(false);

  const popModal = () => {
    setEditModal(!editModal);
  };

  return (
    <>
      <div className='relative z-10 bg-[#FAFAFA]'>
        <div
          className={`inline-flex w-full items-start justify-start gap-10 px-10 ${
            editModal && 'fixed bg-[#F7F7F7] opacity-20'
          }`}
        >
          {/* <Header /> */}
          <div className='h-screen w-[360px]'>
            <div className='self-strech flex h-screen flex-col items-start gap-[26px] px-8 py-32'>
              <img src='/avatar.svg' alt='avatar' width={80} height={80} />
              <div className='text-[32px] font-semibold leading-tight'>
                Alexa Smith
              </div>
              <div className='text-base font-normal text-[#18161C66]'>
                Bio description. Write a short paragraph to impress potential
                clients..
              </div>
              <button
                className='text-primary-default flex items-center justify-center gap-2 px-3 py-1.5'
                onClick={popModal}
              >
                <img
                  src='/images/edit-03.png'
                  alt='edit'
                  width={18}
                  height={18}
                />
                Edit Profile
              </button>
            </div>
          </div>
          <div className='flex w-[calc(100%_-_360px)] flex-col items-start gap-y-6'>
            <div className='self-strech flex w-full flex-row items-start justify-between'>
              <Dribble key='dribble' />
              <Spotify key='spotify' />
              <Instgram key='instgram' />
            </div>
            <div className='self-strech flex w-full flex-row items-start justify-between'>
              <Github key='github' />
              <SoundCloud key='soundCloud' />
              <Youtube key='youtube' />
            </div>
          </div>
        </div>
        <div
          className={`fixed z-10 w-screen overflow-y-auto ${
            editModal && 'inset-0'
          }`}
        >
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <ProfileEditModal editModal={editModal} popModal={popModal} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
