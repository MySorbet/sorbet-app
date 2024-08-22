import { zodResolver } from '@hookform/resolvers/zod';
import { MarkerPin02 } from '@untitled-ui/icons-react';
import { Loader } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { InputSkills } from '@/components/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  useDeleteProfileImage,
  useGooglePlacesApi,
  useUpdateUser,
  useUploadProfileImage,
} from '@/hooks';
import type { User } from '@/types';

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
  showEditModal: boolean;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  editModalVisible,
  handleModalVisible,
  user,
  showEditModal,
}) => {
  const [image, setImage] = useState<string | undefined>(
    user?.profileImage || undefined
  );
  const [skills, setSkills] = useState<string[]>([]);
  const [file, setFile] = useState<Blob | undefined>(undefined);

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

  const {
    predictions,
    setPredictions,
    handleLocationInputChange,
    loadError,
  } = useGooglePlacesApi(showEditModal);

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

  const fileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
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

  if (loadError) {
    console.error('Failed to load Google Maps API');
  }

  return (
    <Dialog open={editModalVisible} onOpenChange={handleModalVisible}>
      <DialogContent
        className={
          updateProfilePending ||
          deleteProfileImagePending ||
          uploadProfileImagePending
            ? 'opacity-50'
            : ''
        }
      >
        <DialogHeader className='text-2xl font-semibold'>
          Edit Profile
        </DialogHeader>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-2 text-[#344054]'>
            <Avatar className='border-primary-default h-20 w-20 border-2'>
              <AvatarImage
                src={image || '/avatar.svg'}
                alt='new profile image'
              />
              <AvatarFallback className='text-2xl font-semibold'>
                {user.accountId.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
                    className='mt-1 w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085] focus:outline-none focus:ring-0'
                    placeholder='Your first name'
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                    defaultValue={user?.firstName}
                  />
                  {errors.firstName && (
                    <p className='mt-1 text-xs text-red-500'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className='w-full'>
                  <label className='text-sm font-medium text-[#344054]'>
                    Last name
                  </label>

                  <Input
                    className='mt-1 w-full rounded-lg border-[#D0D5DD] text-base font-normal text-[#667085] focus:outline-none focus:ring-0'
                    placeholder='Your last name'
                    {...register('lastName', {
                      required: 'Last name is required',
                    })}
                    defaultValue={user?.lastName}
                  />
                  {errors.lastName && (
                    <p className='mt-1 text-xs text-red-500'>
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
                    <div className='relative'>
                      <Command>
                        <div className='relative'>
                          <Input
                            type='text'
                            placeholder='Type a location'
                            {...register('city', {
                              required: 'Location is required',
                            })}
                            onChange={handleLocationInputChange}
                            autoComplete='off'
                            className='pl-10'
                          />
                          <MarkerPin02 className='absolute left-3 top-[10px] h-5 w-5 text-[#667085]' />
                        </div>

                        <CommandList
                          className={
                            predictions.length
                              ? // TODO: Update the styling here. Kind of flaky in that we are moving the list down with fixed values.
                                'absolute top-10 mt-1 w-full rounded-lg border border-gray-200 bg-white text-black drop-shadow-xl'
                              : 'hidden'
                          }
                        >
                          <CommandGroup>
                            {predictions.map((prediction) => (
                              <CommandItem
                                key={prediction.place_id}
                                value={prediction.description}
                                onSelect={() => {
                                  setValue('city', prediction.description);
                                  setPredictions([]);
                                }}
                                className=' text-black'
                              >
                                {prediction.description}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                />
                {errors.city && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div className='item w-full'>
                <label className='text-sm font-medium text-[#344054]'>
                  Create a short Bio
                </label>
                <textarea
                  className='border-1 mt-1 w-full rounded-lg border border-[#D0D5DD] p-3 text-base font-normal text-[#667085] focus:outline-none'
                  placeholder='A few words about yourself'
                  rows={4}
                  {...register('bio', { required: 'Bio is required' })}
                  defaultValue={user?.bio}
                />
                <label className='text-sm font-normal text-[#475467]'>
                  Max 100 characters
                </label>
                {errors.bio && (
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.bio.message}
                  </p>
                )}
              </div>
              <div className='item w-full'>
                <Controller
                  name='tags'
                  control={control}
                  render={() => (
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
                  <p className='mt-1 text-xs text-red-500'>
                    {errors.tags.message}
                  </p>
                )}
              </div>
              <div className='w-full'>
                <Button
                  type='submit'
                  className='bg-sorbet w-full'
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
