import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { User01, X } from '@untitled-ui/icons-react';
import { CircleAlert, CircleCheck, Loader2 } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Controller,
  ControllerRenderProps,
  useFormState,
} from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { checkHandleIsAvailable } from '@/api/auth';
import { BioStatus } from '@/components/profile/bio-status';
import SkillInput from '@/components/syntax-ui/skill-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MAX_BIO_LENGTH } from '@/constant';
import {
  useDeleteProfileImage,
  useUpdateUser,
  useUploadProfileImage,
} from '@/hooks';
import type { User } from '@/types';

import { LocationInput } from './location-input';

interface ProfileEditModalProps {
  editModalVisible: boolean;
  handleModalVisible: (open: boolean) => void;
  user: User;
}

// TODO: debounce so that not too many requests are made when typing
const refine = async (handle: string, initialHandle: string) => {
  if (handle === initialHandle) return true; // initial handle generated for this user is allowed
  if (handle.length === 0) return false;
  const res = await checkHandleIsAvailable(handle);
  return res.data.isUnique;
};

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  editModalVisible,
  handleModalVisible,
  user,
}) => {
  const [image, setImage] = useState<string | undefined>(
    user?.profileImage || undefined
  );
  const [file, setFile] = useState<Blob | undefined>(undefined);

  const queryClient = useQueryClient();

  const schema = z.object({
    isImageUpdated: z.boolean(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    bio: z
      .string()
      .max(MAX_BIO_LENGTH, `Bio must be at most ${MAX_BIO_LENGTH} characters`),
    city: z.string(),
    tags: z.array(z.string()).optional(),
    handle: z
      .string()
      .min(1, { message: 'Handle is required' })
      .max(25, { message: 'Handle must be less than 25 characters' })
      .regex(/^[a-z0-9-_]+$/, {
        message:
          'Handle may only contain lowercase letters, numbers, dashes, and underscores',
      }) // Enforce lowercase, no spaces, and allow dashes
      .refine((handle) => refine(handle, user?.handle ?? ''), {
        message: 'This handle is already taken',
      }),
    location: z.string().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isImageUpdated: false, // --> since image is not controlled by form, this allows us to stay within RHF for disabling the 'Save Changes' button.
      firstName: user?.firstName,
      lastName: user?.lastName,
      bio: user?.bio,
      city: user?.city,
      tags: user?.tags,
      handle: user?.handle ?? '',
    },
  });

  const { errors, isSubmitSuccessful } = form.formState;

  const bioLength = form.watch('bio').length;
  const isMaxBioLength = bioLength > MAX_BIO_LENGTH;

  const { isDirty } = useFormState({ control: form.control });

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
    // TODO: eventually consolidate these two calls since they are called together in multiple places
    // Can be as simple as changing the 'isImageUpdated' property in zod schema from boolean to the string value of 'image'
    setImage(URL.createObjectURL(i));
    form.setValue('isImageUpdated', true, { shouldDirty: true });
  };

  const deleteImage = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const isImageUpdated = form.getValues('isImageUpdated');
    // If there is a pre-existing image and we delete, we are considering it dirty
    // If there is no image and we supply one, but then delete, we are considering it clean
    form.setValue('isImageUpdated', !isImageUpdated, {
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
    form.setValue('tags', newSkills, {
      shouldDirty: true,
    });
  };

  // This change handler allows us to mask the input to only allow valid handles to be typed or pasted
  // We still have zod validate the form, but this creates a better user experience by guiding
  // the user to a valid handle rather than erroring out when they "do something wrong"
  const handleInputChange = (
    field: ControllerRenderProps<FormData, 'handle'>,
    value: string
  ) => {
    field.onChange(
      value
        .replace(/[^a-zA-Z0-9 _-]/g, '') // Remove invalid characters
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .toLowerCase() // Convert to lowercase
    );
  };

  const loading =
    updateProfilePending ||
    deleteProfileImagePending ||
    uploadProfileImagePending;

  // This effect is to make sure that the form is updated with all the newest changes or restore default values
  useEffect(() => {
    if (!isSubmitSuccessful) {
      form.reset();
      setImage(user?.profileImage || undefined);
      return;
    }
    const values = form.getValues();
    form.reset({ ...values, isImageUpdated: false });
  }, [
    isSubmitSuccessful,
    form.reset,
    form.getValues,
    editModalVisible,
    user?.profileImage,
    form,
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
        {/* Where the form starts */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
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
                  onClick={
                    image || user?.profileImage ? deleteImage : undefined
                  }
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
            <FormField
              control={form.control}
              name='handle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium text-[#344054]'>
                    Handle
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...form.register('handle')}
                        placeholder='my-sorbet-handle'
                        {...field}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                      />
                      {errors.handle ? (
                        <CircleAlert className='absolute right-4 top-3 h-4 w-4 text-[#D92D20]' />
                      ) : (
                        <CircleCheck className='absolute right-4 top-3 h-4 w-4 text-[#00A886]' />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className='animate-in slide-in-from-top-1 fade-in-0' />
                </FormItem>
              )}
            />
            <div className='flex w-full flex-row gap-6'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-sm font-medium text-[#344054]'>
                      First name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...form.register('firstName')}
                        placeholder='First name'
                        {...field}
                        className='w-full'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-sm font-medium text-[#344054]'>
                      Last name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...form.register('lastName')}
                        placeholder='Last name'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='city'
              render={() => (
                <FormItem>
                  <FormLabel>Where are you located?</FormLabel>
                  <FormControl>
                    <LocationInput
                      register={form.register}
                      setValue={form.setValue}
                      name='city'
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bio'
              render={() => (
                <FormItem>
                  <FormLabel>Create a short bio</FormLabel>
                  <FormControl>
                    <textarea
                      className='border-1 mt-1 w-full resize-none rounded-lg border border-[#D0D5DD] p-3 text-base font-normal text-[#667085] focus:outline-none'
                      placeholder='A few words about yourself'
                      rows={4}
                      {...form.register('bio', { required: 'Bio is required' })}
                      defaultValue={user?.bio}
                    />
                  </FormControl>
                  <BioStatus isMax={isMaxBioLength} length={bioLength} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tags'
              render={() => (
                <FormItem>
                  <SkillInput
                    initialSkills={user?.tags || []}
                    onSkillsChange={handleSkillChange}
                    unique
                    {...form.register('tags')}
                  />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='bg-sorbet w-full'
              disabled={loading || !isDirty}
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
