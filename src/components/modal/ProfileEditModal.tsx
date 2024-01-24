/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { useEffect, useState } from 'react';

import Autocomplete from '@/components/profile/editProfile/autocomplete';
import Location from '@/components/profile/editProfile/location';

import { uploadProfileImageAsync } from '@/api/images';
import { deleteProfileImageAsync } from '@/api/user';
import { TOTAL_SKILLS } from '@/constant/skills';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import { API_URL } from '@/utils';

import UserType from '@/types/user';

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
  profileBannerImage: '',
  tempLocation: '',
  tags: [''],
  role: '',
  nearWallet: '',
};

const ProfileEditModal = ({ editModal, popModal }: Props) => {
  const userInfo = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState<UserType>(initUser);
  const [image, setImage] = useState(userInfo?.profileImage);
  const [file, setFile] = useState(null);
  const [bannerImage, setBannerImage] = useState(userInfo?.profileBannerImage);
  const [bannerImageSize, setBannerImageSize] = useState('');
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    setUserData(userInfo);
    setImage(userInfo.profileImage);
    if (userInfo.profileBannerImage) {
      setBannerImage('uploaded');
    }
  }, [userInfo]);

  const onChange = (e: any) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e: any) => {
    let userToPost = userData;
    let profileImgRes = '';
    let profileBannerImgRes = '';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userData.id + Date.now().toString());
      formData.append(
        'bucketName',
        process.env.NEXT_PUBLIC_GCP_PROFILE_BUCKET_NAME ?? 'sorbet_profile'
      );
      const res = await uploadProfileImageAsync(formData);
      profileImgRes = res.data.fileUrl;
    }

    if (bannerFile) {
      const formData = new FormData();
      formData.append('file', bannerFile);
      formData.append('userId', 'banner' + userData.id + Date.now().toString());
      formData.append(
        'bucketName',
        process.env.NEXT_PUBLIC_GCP_PROFILE_BUCKET_NAME ?? 'sorbet_profile'
      );
      const res = await uploadProfileImageAsync(formData);
      profileBannerImgRes = res.data.fileUrl;
    }
    userToPost = {
      ...userData,
      profileBannerImage: profileBannerImgRes
        ? profileBannerImgRes
        : userData.profileBannerImage,
        profileImage: profileImgRes
        ? profileImgRes
        : userData.profileImage    
      };

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

  const bannerImageChange = (e: any) => {
    if (e.target.files[0]?.size > 5 * 1024 * 1024) {
      return;
    }

    setBannerFile(
      e.target.files && e.target.files.length > 0
        ? e.target.files[0]
        : undefined
    );
    const i = e.target.files[0];
    setBannerImage(i.name);
    let size: string;
    if (i.size / 1024 >= 1024) {
      size = Math.round(i.size / (1024 * 1024)) + ' MB';
    } else if (i.size / 1024 >= 1) {
      size = Math.round(i.size / 1024) + ' KB';
    } else {
      size = Math.round(i.size) + ' B';
    }
    setBannerImageSize(size);
  };

  const onClose = () => {
    setUserData(userInfo);
    if (userInfo.profileBannerImage) {
      setBannerImage('uploaded');
    }
    setImage(userInfo.profileImage);
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

  const addSkillToTags = (selectedSkill: string) => {
    if (!userData.tags.includes(selectedSkill) && userData.tags.length < 5) {
      setUserData({ ...userData, tags: [...userData.tags, selectedSkill] });
    }
  };

  return (
    <>
      <div
        className={`z-50 flex h-5/6 w-[570px] flex-col items-start justify-start gap-6 overflow-y-auto rounded-[32px] bg-white p-6 text-black max-sm:h-5/6 max-sm:w-[300px] ${
          editModal ? 'fixed' : 'hidden'
        }`}
      >
        <div className='flex w-full items-start justify-between gap-3'>
          <div className='text-3xl font-semibold'>Edit Profile</div>
          <img
            src='/images/cancel.png'
            alt='cancel'
            className='cursor-pointer'
            width={40}
            height={40}
            onClick={onClose}
          />
        </div>
        <div className='flex items-center gap-2 text-[#344054]'>
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
            className='flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border-[1px] border-[#D0D5DD] px-3 py-2 text-sm font-semibold'
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
              className='flex cursor-pointer items-center justify-center rounded-lg border-[1px] border-[#D0D5DD] p-2'
              onClick={deleteImage}
            >
              <img
                src='/images/trash-01.svg'
                alt='trash'
                width={20}
                height={20}
              />
            </div>
          )}
        </div>
        <div className='self-strech flex w-full flex-col items-start gap-1'>
          <div className='text-sm font-medium'>Add cover image</div>
          <div className='flex w-full flex-col items-start gap-4 rounded-2xl bg-[#F9FAFB] p-4'>
            <div className='flex w-full flex-col items-center gap-3 rounded-xl border-[1px] border-[#EAECF0] bg-white px-6 py-4'>
              <label
                htmlFor='profileBannerImage'
                className='flex cursor-pointer items-center justify-center'
              >
                <img
                  src='/images/profile/upload-cloud.svg'
                  alt='upload-cloud'
                  className='h-10 w-10 cursor-pointer rounded-lg border-[1px] border-[#EAECF0] p-[10px]'
                />
                <input
                  id='profileBannerImage'
                  name='profileBannerImage'
                  onChange={(e) => bannerImageChange(e)}
                  type='file'
                  className='hidden'
                  accept='image/*'
                />
              </label>
              <div className='flex flex-col items-center gap-1'>
                <div className='flex items-center justify-center gap-[6px] text-xs font-normal'>
                  <span className='font-semibold text-[#6941C6]'>
                    Click to upload cover image
                  </span>
                  <div>or drag and drop</div>
                </div>
                <div className='text-xs font-normal'>
                  SVG, PNG, JPG or GIF (max. 5MB)
                </div>
              </div>
            </div>
            {bannerImage && (
              <div className='flex w-full flex-row rounded-xl border-[1px] border-[#EAECF0] bg-white p-4'>
                <div className='flex flex-row items-start gap-2'>
                  <img
                    src='/images/profile/file.svg'
                    alt='file'
                    width={20}
                    height={20}
                  />
                  <div className='flex flex-col items-start text-sm'>
                    <div className='font-medium text-[#344054]'>
                      {bannerImage}
                    </div>
                    <div className='font-normal text-[#475467]'>
                      {bannerImageSize + ' – 100% uploaded'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex w-full flex-row gap-6'>
          <div className='item'>
            <label className='text-sm font-medium text-[#344054]'>
              First name
            </label>
            <input
              className='w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085]'
              placeholder='Jon'
              name='firstName'
              defaultValue={userData?.firstName}
              onChange={onChange}
            />
          </div>
          <div className='item'>
            <label className='text-sm font-medium text-[#344054]'>
              Last name
            </label>

            <input
              className='w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085]'
              placeholder='Smith'
              name='lastName'
              defaultValue={userData?.lastName}
              onChange={onChange}
            />
          </div>
        </div>
        <div className='item w-full'>
          <label className='text-sm font-medium text-[#344054]'>
            What’s your profession?
          </label>
          <input
            className='w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085]'
            placeholder='Product Designer'
            name='title'
            defaultValue={userData?.title}
            onChange={onChange}
          />
        </div>
        <div className='item w-full'>
          <label className='text-sm font-medium text-[#344054]'>
            Where are you located?
          </label>
          <Location
            userData={userData}
            setUserData={setUserData}
            onInputChange={onChange}
            defaultValue={userData?.tempLocation}
          />
        </div>
        <div className='item w-full'>
          <label className='text-sm font-medium text-[#344054]'>
            Create a short Bio
          </label>
          <textarea
            className='w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085]'
            placeholder='Describe yourself and your skills'
            name='bio'
            rows={4}
            defaultValue={userData?.bio}
            onChange={onChange}
          />
          <label className='text-sm font-normal text-[#475467]'>
            Max 200 characters
          </label>
        </div>
        <div className='item w-full'>
          <Autocomplete
            options={TOTAL_SKILLS}
            placeholder='Skill (ex: Developer)'
            onSelect={addSkillToTags}
            userEdit={userData}
            setUserEdit={setUserData}
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
    </>
  );
};

export default ProfileEditModal;
