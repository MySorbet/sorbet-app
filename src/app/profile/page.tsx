/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';

import './profile.css';

import UserHeader from '@/components/Header/userHeader';
import ProfileEditModal from '@/components/modal/profileEditModal';
import AddWidget from '@/components/profile/addWidget/addWidget';
import UserWidgetContainer from '@/components/profile/addWidget/userWidgetContainer';

import { getWidgetsFromUserId } from '@/api/user';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { initwidgets } from '@/redux/profileSlice';

const Profile = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.userReducer.user);
  const widgetData = useAppSelector((state) => state.profileReducer.widgets);
  const [editModal, setEditModal] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);

  useEffect(() => {
    const getWidgets = async () => {
      if (userInfo.id) {
        const res = await getWidgetsFromUserId(userInfo.id);
        dispatch(initwidgets(res.data));
      }
    };
    getWidgets();
  }, [userInfo]);

  const popModal = () => {
    setEditModal(!editModal);
  };

  const toggleAddLink = () => {
    setShowAddLink(!showAddLink);
  };

  return (
    <>
      <div className='relative z-10 bg-[#FAFAFA]'>
        <div
          className={`flex h-full w-full items-start justify-center ${
            editModal && 'fixed bg-[#F7F7F7] opacity-20'
          }`}
        >
          <UserHeader />
          <div className='h-screen w-[500px] pl-[100px] pr-10'>
            <div className='self-strech flex h-screen flex-col items-start gap-[26px] px-8 py-32'>
              {userInfo.profileImage ? (
                <img
                  src={userInfo.profileImage}
                  alt='avatar'
                  className='border-primary-default h-20 w-20 rounded-full border-2'
                />
              ) : (
                <img src='./avatar.svg' alt='avatar' width={80} height={80} />
              )}
              <div className='text-[32px] font-semibold leading-tight'>
                {userInfo?.firstName + ' ' + userInfo?.lastName}
              </div>
              <div className='text-base font-normal text-[#18161C66]'>
                {userInfo?.bio}
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
          <div className='content grid min-h-screen grid-cols-3 items-start gap-x-10 gap-y-6 bg-[#FAFAFA] px-10 pt-[128px] max-md:grid-cols-2 max-sm:grid-cols-1'>
            {widgetData?.map((widget: any) => {
              return (
                <UserWidgetContainer
                  key={widget?.id}
                  link={widget?.url}
                  type={widget?.type}
                />
              );
            })}
          </div>
          <div className='h-screen w-[100px]'></div>
          <div className='footer relative flex w-full cursor-pointer gap-[10px] px-8 py-4'>
            <img
              src='/images/add.png'
              alt='add'
              width={64}
              height={64}
              onClick={toggleAddLink}
            />
            {showAddLink && <AddWidget />}
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
