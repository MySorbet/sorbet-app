import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { User01, X } from '@untitled-ui/icons-react';
import { Loader2 } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { Controller, useFormState } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LocationInput } from '@/components/profile';
import SkillInput from '@/components/syntax-ui/skill-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  useDeleteProfileImage,
  useUpdateUser,
  useUploadProfileImage,
} from '@/hooks';
import type { User } from '@/types';

const schema = z.object({
  isImageUpdated: z.boolean(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().max(100, 'Bio must be at most 100 characters'),
  city: z.string(),
  tags: z.array(z.string()).optional(),
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
  const [image, setImage] = useState<string | undefined>();
  const [file, setFile] = useState<Blob | undefined>(undefined);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    control,
    setValue,
    getValues,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isImageUpdated: false, // --> since image is not controlled by form, this allows us to stay within RHF for disabling the 'Save Changes' button.
      firstName: user?.firstName,
      lastName: user?.lastName,
      bio: user?.bio,
      city: user?.city,
      tags: user?.tags,
    },
  });

  const { dirtyFields } = useFormState({ control });

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

  const { isPending: updateProfilePending, mutateAsync: updateProfileAsync } =
    useUpdateUser();

  const onSubmit = async (formData: FormData) => {
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
        ...formData,
      };
      // TODO: take a deeper dive into 'mutate' vs 'mutate async' and how the flow of the onSubmit should behave.
      await updateProfileAsync(userToUpdate);
      // Here we invaldiate the query key 'freelancer' which is what the 'user' prop is.
      queryClient.invalidateQueries({ queryKey: ['freelancer'] });
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
    setValue('isImageUpdated', true, { shouldDirty: true });
  };

  const deleteImage = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const isImageUpdated = getValues('isImageUpdated');
    // If there is a pre-existing image and we delete, we are considering it dirty
    // If there is no image and we supply one, but then delete, we are considering it clean
    setValue('isImageUpdated', isImageUpdated ? false : true, {
      shouldDirty: true,
    });

    setImage(undefined);
    setFile(undefined);

    const fileInput = document.getElementById(
      'profileImage'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSkillChange = (newSkills: string[]) => {
    setValue('tags', newSkills, {
      shouldDirty: true,
    });
  };

  const loading =
    updateProfilePending ||
    deleteProfileImagePending ||
    uploadProfileImagePending;

  // This effect is to make sure that the form is updated with all the newest changes
  useEffect(() => {
    if (!isSubmitSuccessful) {
      reset();
      setImage(user?.profileImage || undefined);
      return;
    }
    const values = getValues();
    reset({ ...values, isImageUpdated: false });
  }, [
    isSubmitSuccessful,
    reset,
    getValues,
    editModalVisible,
    user?.profileImage,
  ]);

  return (
    <Dialog open={editModalVisible} onOpenChange={handleModalVisible}>
      <DialogContent
        className='sm:rounded-[32px]'
        hideDefaultCloseButton={true}
        aria-describedby={undefined}
      >
        <DialogTitle>
          <DialogHeader className='flex w-full flex-row items-start justify-between text-2xl font-semibold'>
            <p>Edit Profile</p>
            <X
              className='h-6 w-6 cursor-pointer text-[#98A2B3] transition ease-out hover:scale-110'
              onClick={() => handleModalVisible(false)}
            />
          </DialogHeader>
        </DialogTitle>
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-2 text-[#344054]'>
            <Avatar className='border-primary-default h-20 w-20 border-2'>
              <AvatarImage src={image} alt='new profile image' />
              <AvatarFallback className='bg-white'>
                <User01 className='text-muted-foreground h-10 w-10' />
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
                  render={() => (
                    <LocationInput
                      register={register}
                      setValue={setValue}
                      name='city'
                    />
                  )}
                />
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
                  {...register('tags')}
                  name='tags'
                  control={control}
                  render={() => (
                    <SkillInput
                      {...register('tags')}
                      initialSkills={user?.tags || []}
                      unique
                      onSkillsChange={handleSkillChange}
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
                  disabled={loading || Object.keys(dirtyFields).length <= 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Saving
                    </>
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
