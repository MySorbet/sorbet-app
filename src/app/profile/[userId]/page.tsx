/* eslint-disable @next/next/no-img-element */
'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

import '../profile.css';

import ExploreHeader from '@/components/Header/exploreHeader';
import SendMessage from '@/components/modal/sendMessage';
import UserWidgetContainer from '@/components/profile/addWidget/userWidgetContainer1';

import { useAppSelector } from '@/redux/hook';
import { API_URL } from '@/utils';

const initUser = {
  id: '',
  firstName: '',
  lastName: '',
  accountId: '',
  email: '',
  bio: '',
  title: '',
  profileImage: '',
  tempLocation: '',
};

const Profile = ({ params }: any) => {
  const currentUser = useAppSelector((state) => state.userReducer.user);
  const [user, setUser] = useState(initUser);
  const [widgets, setWidgets] = useState([]);
  const [editModal, setEditModal] = useState(false);

  const getUser = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/user/getUserById/${params.userId}`
      );
      setUser(res.data);
      setWidgets(res.data.widgets);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, [currentUser]);

  const popModal = () => {
    setEditModal(!editModal);
  };

  return (
    <>
      <div className='relative z-10 bg-[#FAFAFA]'>
        <div
          className={`flex h-full w-full flex-row items-start justify-center gap-10 px-10 ${
            editModal && 'fixed bg-[#F7F7F7] opacity-20'
          }`}
        >
          <ExploreHeader popModal={popModal} freelancerId={params.userId} />
          <div className='h-screen w-[360px]'>
            <div className='self-strech flex h-screen flex-col items-start gap-[26px] px-8 py-32'>
              {user?.profileImage ? (
                <img
                  src={user?.profileImage}
                  alt='avatar'
                  className='border-primary-default h-20 w-20 rounded-full border-2'
                />
              ) : (
                <img src='/avatar.svg' alt='avatar' width={80} height={80} />
              )}
              <div className='flex flex-col items-start self-stretch font-normal text-[#595B5A]'>
                <div className='text-[32px] font-semibold leading-tight text-[#101010]'>
                  {user?.firstName + ' ' + user?.lastName}
                </div>
                <div className='text-base'>{user?.title}</div>
                <div className='text-xs'>{user?.tempLocation}</div>
              </div>
              <div className='text-base font-normal text-[#101010] text-[#18161C66]'>
                {user?.bio}
              </div>
            </div>
          </div>
          <div className='grid min-h-screen w-full grid-cols-3 items-start gap-x-10 gap-y-6 px-10 pt-[128px] max-md:grid-cols-2 max-sm:grid-cols-1'>
            {widgets?.map((widget: any) => {
              return (
                <UserWidgetContainer
                  key={widget?.id}
                  link={widget?.url}
                  type={widget?.type}
                />
              );
            })}
          </div>
        </div>

        <div
          className={`fixed z-10 w-screen overflow-y-auto ${
            editModal && 'inset-0'
          }`}
        >
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <SendMessage
              editModal={editModal}
              popModal={popModal}
              freelancerId={params.userId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
