import { uploadProfileImageAsync } from '@/api/images';
import { deleteProfileImageAsync } from '@/api/user';
import { InputLocation, InputSkills } from '@/components/profile';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TOTAL_SKILLS } from '@/constant/skills';
import { config } from '@/lib/config';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import type { User } from '@/types';
import { API_URL } from '@/utils';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface ProfileEditModalProps {
  editModalVisible: boolean;
  handleModalVisisble: (open: boolean) => void;
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

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  editModalVisible,
  handleModalVisisble,
}) => {
  const userInfo = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState<User>(initUser);
  const [image, setImage] = useState(userInfo?.profileImage);
  const [file, setFile] = useState(null);
  const [bannerImage, setBannerImage] = useState(userInfo?.profileBannerImage);
  const [bannerImageSize, setBannerImageSize] = useState('');
  const [bannerFile, setBannerFile] = useState(null);

  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

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
    const bucketName = config.gcpProfileBucketName ?? 'sorbet_profile';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userData.id + Date.now().toString());
      formData.append('bucketName', bucketName);
      const res = await uploadProfileImageAsync(formData);
      profileImgRes = res.data.fileUrl;
    }

    if (bannerFile) {
      const formData = new FormData();
      formData.append('file', bannerFile);
      formData.append('userId', 'banner' + userData.id + Date.now().toString());
      formData.append('bucketName', bucketName);
      const res = await uploadProfileImageAsync(formData);
      profileBannerImgRes = res.data.fileUrl;
    }
    userToPost = {
      ...userData,
      profileBannerImage: profileBannerImgRes
        ? profileBannerImgRes
        : userData.profileBannerImage,
      profileImage: profileImgRes ? profileImgRes : userData.profileImage,
    };

    const apiUrl = `${API_URL}/user/${userData.id}`;
    try {
      const res = await axios.patch(apiUrl, userToPost);
      dispatch(updateUserData(res.data));
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
    <Dialog open={editModalVisible} onOpenChange={handleModalVisisble}>
      <DialogContent>
        <DialogHeader className='text-2xl font-semibold'>
          Edit Profile
        </DialogHeader>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-2 text-[#344054]'>
            {image ? (
              <img
                src={image}
                alt='avatar'
                className='border-primary-default h-20 w-20 rounded-full border-2'
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
          <div className='flex w-full flex-row gap-6'>
            <div className='item'>
              <label className='text-sm font-medium text-[#344054]'>
                First name
              </label>
              <Input
                className='w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085] mt-1'
                placeholder='Your first name'
                name='firstName'
                defaultValue={userData?.firstName}
                onChange={onChange}
              />
            </div>
            <div className='item'>
              <label className='text-sm font-medium text-[#344054]'>
                Last name
              </label>

              <Input
                className='w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085] mt-1'
                placeholder='Your last name'
                name='lastName'
                defaultValue={userData?.lastName}
                onChange={onChange}
              />
            </div>
          </div>
          <div className='item w-full'>
            <label className='text-sm font-medium text-[#344054]'>
              Where are you located?
            </label>
            <InputLocation
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
              className='w-full rounded-lg border border-1 p-3 border-[#D0D5DD] text-base font-normal text-[#667085] mt-1'
              placeholder='A few words about yourself'
              name='bio'
              rows={4}
              defaultValue={userData?.bio}
              onChange={onChange}
            />
            <label className='text-sm font-normal text-[#475467]'>
              Max 60 characters
            </label>
          </div>
          <div className='item w-full'>
            <InputSkills
              options={TOTAL_SKILLS}
              placeholder='Skill (ex: Developer)'
              onSelect={addSkillToTags}
              userEdit={userData}
              setUserEdit={setUserData}
            />
          </div>
          <div className='w-full'>
            <Button className='w-full bg-sorbet'>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
