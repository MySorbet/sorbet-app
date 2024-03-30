import { uploadProfileImageAsync } from '@/api/images';
import { deleteProfileImageAsync } from '@/api/user';
import { updateUser } from '@/api/user';
import { InputLocation, InputSkills } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { updateUserData } from '@/redux/userSlice';
import type { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z
    .string()
    .max(100, 'Bio must be at most 100 characters')
    .min(5, 'Bio must be at least 5 characters'),
  city: z.string().min(1, 'Location is required'),
  tags: z.array(z.string()).min(1, 'At least one skill is required'),
});

type FormData = z.infer<typeof schema>;

interface ProfileEditModalProps {
  editModalVisible: boolean;
  handleModalVisisble: (open: boolean) => void;
  user?: User;
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
  city: '',
};

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  editModalVisible,
  handleModalVisisble,
  user,
}) => {
  const userInfo = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState<User>(initUser);
  const [image, setImage] = useState(userInfo?.profileImage);
  const [skills, setSkills] = useState<string[]>([]);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: (userToUpdate: User) =>
      updateUser(userToUpdate, userToUpdate.id),
    onSuccess: (user: User) => {
      dispatch(updateUserData(user));
      handleModalVisisble(false);
    },
    onError: (error: any) => {
      alert(
        'Unable to save changes to your profile due to an issue at our end, please try again soon.'
      );
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      bio: user?.bio,
      city: user?.city,
      tags: user?.tags,
    },
  });

  const onChange = (e: any) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    let profileImgRes = '';

    if (user) {
      const userToUpdate = {
        ...user,
        profileImage: profileImgRes ? profileImgRes : userData.profileImage,
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        tags: skills,
        bio: data.bio,
      };

      updateProfileMutation.mutate(userToUpdate);
    } else {
      alert('Unable to update profile details right now.');
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

  const handleSkillChange = (skills: string[]) => {
    setSkills(skills);
  };

  return (
    <Dialog open={editModalVisible} onOpenChange={handleModalVisisble}>
      <DialogContent className={isSubmitting ? 'opacity-50' : ''}>
        {' '}
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
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <InputLocation
                      onInputChange={(e) => {
                        field.onChange(e);
                        onChange(e);
                      }}
                      onPlaceSelected={(place) =>
                        console.log(JSON.stringify(place))
                      }
                      defaultValue={
                        userInfo && userInfo.city ? userInfo.city : ''
                      }
                    />
                  )}
                />
                {errors.city && (
                  <p className='text-xs text-red-500 mt-1'>
                    {errors.city.message}
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
                  name='tags'
                  control={control}
                  render={({ field }) => (
                    <InputSkills
                      placeholder='Skill (ex: Developer)'
                      handleTagsChange={(tags) => {
                        handleSkillChange(tags);
                      }}
                      initialTags={user?.tags}
                    />
                  )}
                />
                {errors.tags && (
                  <p className='text-xs text-red-500 mt-1'>
                    {errors.tags.message}
                  </p>
                )}
              </div>
              <div className='w-full'>
                <Button className='w-full bg-sorbet' disabled={isSubmitting}>
                  {isSubmitting ? <Loader /> : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
