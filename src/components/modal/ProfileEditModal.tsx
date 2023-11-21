/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { useEffect, useState } from 'react';

import { uploadProfileImageAsync } from '@/api/images';
import { deleteProfileImageAsync } from '@/api/user';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { API_URL } from '@/utils';

interface Props {
  editModal: boolean;
  popModal: any;
}

const initUser = {
  id: '',
  firstName: '',
  lastName: '',
  accountId: '',
  email: '',
  bio: '',
  title: '',
  profileImage: '',
  tempLocation: ''
}

const ProfileEditModal = ({ editModal, popModal }: Props) => {
  const userInfo = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState(initUser);
  const [image, setImage] = useState(userInfo?.profileImage);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setUserData(userInfo);
    setImage(userInfo.profileImage);
  }, [userInfo]);

  const onChange = (e: any) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e: any) => {
    let userToPost = userData;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userData.id + Date.now().toString());
      formData.append(
        'bucketName',
        process.env.NEXT_PUBLIC_GCP_PROFILE_BUCKET_NAME ?? 'sorbet_profile'
      );
      const imgResponse = await uploadProfileImageAsync(formData);

      userToPost = {
        ...userData,
        profileImage: imgResponse.data.fileUrl
          ? imgResponse.data.fileUrl
          : userData.profileImage,
      };
    }

    const apiUrl = `${API_URL}/user/${userData.id}`;
    try {
      const res = await axios.patch(apiUrl, userToPost);
      dispatch(updateUserData(res.data));
      popModal();
    } catch (err) {
      // console.log(err);
    } finally {
      // setIsSubmitting(false);
    }
  };

  const fileChange = (e: any) => {
    setFile(
      e.target.files && e.target.files.length > 0
        ? e.target.files[0]
        : undefined
    );
    const i = e.target.files[0];
    setImage(URL.createObjectURL(i));
  };

  const onClose = () => {
    setUserData(userInfo);
    popModal();
  };

  const deleteImage = async (e: any) => {
    const res = await deleteProfileImageAsync(userData.id);
    setImage(res.data.profileImage);
    setUserData({
      ...userData,
      profileImage: res.data.profileImage,
    });
    setFile(null);
  };

  return (
    <>
      <div
        className={`z-50 w-[500px] items-center justify-center overflow-y-auto rounded-2xl bg-white p-6 pt-4 text-black max-sm:h-5/6 max-sm:w-[300px] ${
          editModal ? 'fixed' : 'hidden'
        }`}
      >
        <div className='mb-3 flex cursor-pointer justify-end' onClick={onClose}>
          <img src='/images/cancel.png' alt='cancel' width={40} height={40} />
        </div>
        <div className='flex flex-col items-start gap-6 px-6 pb-6'>
          <h1 className='test-[32px]'>Edit Profile</h1>
          <div className='flex items-center gap-2'>
            {image ? (
              <img
                src={image}
                alt='avatar'
                className='border-primary-default w-20 rounded-full border-2'
              />
            ) : (
              <img src='/avatar.svg' alt='avatar' width={80} height={80} />
            )}
            <label
              htmlFor='profileImage'
              className='roundBorder flex h-8 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-[#3B3D46] px-3 py-[6px] text-white'
            >
              Upload
              <input
                id='profileImage'
                name='profileImage'
                onChange={(e) => fileChange(e)}
                type='file'
                className='hidden'
                accept='image/*'
              />
            </label>
            {image && (
              <div
                className='flex cursor-pointer items-center justify-center rounded-lg bg-[#3B3D46] p-[6px]'
                onClick={deleteImage}
              >
                <img
                  src='/images/trash-gray.svg'
                  alt='trash'
                  width={20}
                  height={20}
                />
              </div>
            )}
          </div>
          <div className='row'>
            <div className='item'>
              <label className='text-[#595B5A]'>First name</label>
              <input
                className='w-full rounded-lg'
                placeholder='Jon'
                name='firstName'
                defaultValue={userData?.firstName}
                onChange={onChange}
              />
            </div>
            <div className='item'>
              <label className='text-[#595B5A]'>Last name</label>
              <input
                className='w-full rounded-lg'
                placeholder='Smith'
                name='lastName'
                defaultValue={userData?.lastName}
                onChange={onChange}
              />
            </div>
          </div>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Title</label>
            <input
              className='w-full rounded-lg'
              placeholder='Graphic Designer'
              name='title'
              defaultValue={userData?.title}
              onChange={onChange}
            />
          </div>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Location</label>
            <input
              className='w-full rounded-lg '
              placeholder='Search location'
              name='tempLocation'
              defaultValue={userData?.tempLocation}
              onChange={onChange}
            />
          </div>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Bio</label>
            <textarea
              className='w-full rounded-lg '
              placeholder='Describe yourself and your skills'
              name='bio'
              rows={4}
              defaultValue={userData?.bio}
              onChange={onChange}
            />
          </div>
          <div className='item w-full'>
            <button
              className='bg-primary-default h-11 gap-1 self-stretch rounded-lg px-2 py-1 text-sm text-white'
              onClick={updateProfile}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileEditModal;
