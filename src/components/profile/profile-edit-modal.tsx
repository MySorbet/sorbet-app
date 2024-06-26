import { InputLocation, InputSkills } from '@/components/profile';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  useDeleteProfileImage,
  useUploadProfileImage,
  useUpdateUser,
} from '@/hooks';
import type { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useState } from 'react';
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
  handleModalVisible: (open: boolean) => void;
  user: User;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  editModalVisible,
  handleModalVisible,
  user,
}) => {
  const [image, setImage] = useState<string | undefined>(
    user?.profileImage || undefined
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [file, setFile] = useState<Blob | undefined>(undefined);

  const {
    isPending: uploadProfileImagePending,
    mutateAsync: uploadProfileImageAsync,
    isError: uploadProfileImageError,
  } = useUploadProfileImage();

  const {
    isPending: deleteProfileImagePending,
    mutateAsync: deleteProfileImageAsync,
    isError: deleteProfileImageError,
  } = useDeleteProfileImage();

  const { isPending: updateProfilePending, mutate: updateProfile } =
    useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
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

  const onSubmit = async (data: FormData) => {
    let userToUpdate: User = { ...user };

    if (user?.id && user?.profileImage != null && image === undefined) {
      await deleteProfileImageAsync(user?.id);

      if (deleteProfileImageError) return;

      userToUpdate.profileImage = '';
    } else if (user?.id && image !== user?.profileImage && file !== undefined) {
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      imageFormData.append('fileType', 'image');
      imageFormData.append('destination', 'profile');
      imageFormData.append('oldImageUrl', user?.profileImage);
      imageFormData.append('userId', user?.id);

      await uploadProfileImageAsync({
        imageFormData,
        userToUpdate,
      });
    }

    if (uploadProfileImageError) return;

    if (user) {
      userToUpdate = {
        ...userToUpdate,
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        tags: skills,
        bio: data.bio,
      };

      updateProfile(userToUpdate);

      handleModalVisible(false);
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

  const deleteImage = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    setImage(undefined);
    setFile(undefined);

    const fileInput = document.getElementById(
      'profileImage'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSkillChange = (skills: string[]) => {
    setSkills(skills);
    setValue('tags', skills);
  };

  return (
    <Dialog open={editModalVisible} onOpenChange={handleModalVisible}>
      <DialogOverlay className='bg-black/80' />
      <DialogContent
        className={
          updateProfilePending ||
          deleteProfileImagePending ||
          uploadProfileImagePending
            ? 'opacity-50'
            : ''
        }
      >
        {' '}
        <DialogHeader className='text-2xl font-semibold'>
          Edit Profile
        </DialogHeader>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-2 text-[#344054]'>
            {image && image != '' ? (
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
                className={`flex items-center justify-center rounded-lg border-[1px] border-[#D0D5DD] p-2 ${
                  image || user?.profileImage
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-50'
                }`}
                onClick={image || user?.profileImage ? deleteImage : undefined}
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
                    defaultValue={user?.firstName}
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
                    defaultValue={user?.lastName}
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
                      }}
                      onPlaceSelected={(place) =>
                        setValue('city', place?.formatted_address)
                      }
                      defaultValue={user && user.city ? user.city : ''}
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
                  defaultValue={user?.bio}
                />
                <label className='text-sm font-normal text-[#475467]'>
                  Max 100 characters
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
                <Button
                  type='submit'
                  className='w-full bg-sorbet'
                  disabled={
                    updateProfilePending ||
                    deleteProfileImagePending ||
                    uploadProfileImagePending
                  }
                >
                  {updateProfilePending ||
                  deleteProfileImagePending ||
                  uploadProfileImagePending ? (
                    <Loader />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
