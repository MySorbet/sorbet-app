/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';

import './profile.css';

import UserHeader from '@/components/Header/userHeader';
import ProfileEditModal from '@/components/modal/profileEditModal';
import AddWidget from '@/components/profile/addWidget/addWidget';
import UserWidgetContainer from '@/components/profile/addWidget/userWidgetContainer';
import MapContainer from '@/components/profile/mapContainer';

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
      <div className='relative z-10 bg-[#F9FAFB]'>
        <div className='flex h-full w-full flex-col items-start justify-center'>
          {/* <UserHeader /> */}
          <div className='flex w-full flex-col'>
            <div className='flex w-full justify-between px-8 py-4'>
              <div className='flex gap-6'>
                <img src='/svg/logo.svg' alt='logo' width={44} height={44} />
              </div>
              <div className='flex items-center justify-end gap-4'>
                <div
                  className='cursor-pointer rounded-lg border-[1px] border-[#D0D5DD] bg-white px-[14px] py-[10px] text-sm font-semibold'
                  onClick={popModal}
                >
                  Edit Profile
                </div>
                <img
                  src='/images/menu.svg'
                  alt='menu'
                  className=' cursor-pointer p-[10px]'
                />
              </div>
            </div>
            <div className='flex w-full flex-col px-20'>
              <div className='flex w-full gap-6 p-4'>
                <div
                  className='w-1/2 rounded-[32px] bg-white p-8'
                  style={{
                    backgroundImage: `url(${userInfo.profileBannerImage})`,
                    backgroundSize: 'cover',
                  }}
                >
                  <div className='flex items-center justify-start gap-4'>
                    {userInfo.profileImage ? (
                      <img
                        src={userInfo.profileImage}
                        alt='avatar'
                        width={56}
                        height={56}
                        className='border-primary-default rounded-full border-2'
                      />
                    ) : (
                      <img
                        src='./avatar.svg'
                        alt='avatar'
                        width={56}
                        height={56}
                      />
                    )}
                    <div className='flex flex-col'>
                      <div className='text-2xl font-bold'>
                        {userInfo.firstName + ' ' + userInfo.lastName}
                      </div>
                      {userInfo.tempLocation && (
                        <div className='flex items-center gap-1'>
                          <img
                            src='/svg/location.svg'
                            alt='location'
                            width={16}
                            height={16}
                          />
                          <div className='text-sm font-medium'>
                            {userInfo.tempLocation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex w-1/2 flex-col gap-6'>
                  <div className='flex w-full flex-col gap-6 rounded-[32px] bg-[#0C111D] p-8 text-white'>
                    <div className='flex flex-col items-start gap-4'>
                      <div className='text-2xl font-bold'>{userInfo.title}</div>
                      <div className='self-strach flex w-full flex-wrap gap-[6px] text-[#E9D7FE]'>
                        {userInfo.tags && userInfo.tags.map((skill, index) => 
                          <div key={index} className='rounded-full border-[1.5px] border-[#475467] px-[10px] text-sm font-medium'>
                            {skill}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='text-lg font-medium'>{userInfo.bio}</div>
                  </div>
                  <div className='flex w-full flex-row gap-6'>
                    <div className='flex w-1/2 flex-col items-center justify-center rounded-[32px] bg-white'>
                      <MapContainer locationName={userInfo.tempLocation} />
                    </div>
                    <div className='flex w-1/2 flex-col items-center justify-center gap-2 rounded-[32px] bg-[#573DF5] p-6'>
                      <img
                        src='/images/profile/hire.svg'
                        alt='hire'
                        width={40}
                        height={40}
                      />
                      <div className='text-2xl font-bold text-[#A1E73B]'>
                        Hire me
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='px-4'>
                <div className='border-tertiary relative mt-[60px] flex w-full items-center justify-center gap-[10px] rounded-[16px] border-2 border-dashed border-[#F2F4F7] bg-white px-8 py-4'>
                  <div className='items-center justify-center rounded-full bg-[#F2F4F7] p-[10px]'>
                    <img
                      src='/images/profile/plus.svg'
                      alt='plus'
                      width={24}
                      height={24}
                      onClick={toggleAddLink}
                    />
                  </div>
                  {showAddLink && <AddWidget />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`fixed z-10 w-screen overflow-y-auto ${
            editModal && 'inset-0 bg-[#0C111D70]'
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
