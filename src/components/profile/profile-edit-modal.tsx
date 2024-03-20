import { uploadProfileImageAsync } from '@/api/images';
import { deleteProfileImageAsync } from '@/api/user';
import { InputLocation, InputSkills } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { config } from '@/lib/config';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import type { User } from '@/types';
import { API_URL } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z
    .string()
    .max(60, 'Bio must be at most 60 characters')
    .min(5, 'Bio must be at least 5 characters'),
  location: z.string().min(1, 'Location is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

type FormData = z.infer<typeof schema>;

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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

  const onSubmit = async (e: any) => {
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

  const onClose = () => {
    setUserData(userInfo);
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

  const handleTagsChange = (tags: string[]) => {
    console.log(tags);
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-6'>
              <div className='flex w-full flex-row gap-6'>
                <div className='w-full'>
                  <label className='text-sm font-medium text-[#344054]'>
                    First name
                  </label>
                  <Input
                    className='w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085] mt-1 focus:ring-0 focus:outline-none'
                    placeholder='Your first name'
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                    defaultValue={userData?.firstName}
                    onChange={onChange}
                  />
                  {errors.firstName && (
                    <p className='text-xs text-red-500 mt-1'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className='w-full'>
                  <label className='text-sm font-medium text-[#344054]'>
                    Last name
                  </label>

                  <Input
                    className='w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085] mt-1 focus:ring-0 focus:outline-none'
                    placeholder='Your last name'
                    {...register('lastName', {
                      required: 'Last name is required',
                    })}
                    defaultValue={userData?.lastName}
                    onChange={onChange}
                  />
                  {errors.lastName && (
                    <p className='text-xs text-red-500 mt-1'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='item w-full'>
                <label className='text-sm font-medium text-[#344054]'>
                  Where are you located?
                </label>
                <Controller
                  name='location'
                  control={control}
                  render={({ field }) => (
                    <InputLocation
                      onInputChange={(e) => {
                        field.onChange(e);
                        onChange(e);
                      }}
                      defaultValue={field.value}
                    />
                  )}
                />
                {errors.location && (
                  <p className='text-xs text-red-500 mt-1'>
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className='item w-full'>
                <label className='text-sm font-medium text-[#344054]'>
                  Create a short Bio
                </label>
                <textarea
                  className='w-full rounded-lg border border-1 p-3 border-[#D0D5DD] text-base font-normal text-[#667085] mt-1 focus:outline-none'
                  placeholder='A few words about yourself'
                  rows={4}
                  {...register('bio', { required: 'Bio is required' })}
                  defaultValue={userData?.bio}
                  onChange={onChange}
                />
                <label className='text-sm font-normal text-[#475467]'>
                  Max 60 characters
                </label>
                {errors.bio && (
                  <p className='text-xs text-red-500 mt-1'>
                    {errors.bio.message}
                  </p>
                )}
              </div>
              <div className='item w-full'>
                <Controller
                  name='skills'
                  control={control}
                  render={({ field }) => (
                    <InputSkills
                      placeholder='Skill (ex: Developer)'
                      handleTagsChange={(tags) => {
                        field.onChange(tags);
                        handleTagsChange(tags);
                      }}
                    />
                  )}
                />
                {errors.skills && (
                  <p className='text-xs text-red-500 mt-1'>
                    {errors.skills.message}
                  </p>
                )}
              </div>
              <div className='w-full'>
                <Button className='w-full bg-sorbet'>Save Changes</Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
