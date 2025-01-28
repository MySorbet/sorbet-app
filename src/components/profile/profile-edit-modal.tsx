import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { User01, X } from '@untitled-ui/icons-react';
import { Loader2, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormState } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Textarea } from '@/components/ui/textarea';
import { MAX_BIO_LENGTH } from '@/constant';
import {
  useDeleteProfileImage,
  useUpdateUser,
  useUploadProfileImage,
} from '@/hooks';
import type { User } from '@/types';

import { BioMessage } from './bio-message';
import { HandleInput, validateHandle } from './handle-input';
import { LocationInput } from './location-input';

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
  const [file, setFile] = useState<Blob | undefined>(undefined);

  const queryClient = useQueryClient();
  const router = useRouter();

  const schema = z.object({
    isImageUpdated: z.boolean(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    bio: z
      .string()
      .max(MAX_BIO_LENGTH, `Bio must be at most ${MAX_BIO_LENGTH} characters`)
      .optional(),
    city: z.string(),
    tags: z.array(z.string()).optional(),
    // TODO: eventually, update the user type to make handle required, because as it stands, a user cannot be created without a handle.
    // * This is a temporary fix due to mistyping of User type
    handle: validateHandle(user.handle ?? ''),
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
    mode: 'all',
  });

  const { errors, isSubmitSuccessful } = form.formState;

  const handle = form.watch('handle');
  const bioLength = form.watch('bio')?.length ?? 0;
  const isMaxBioLength = bioLength > MAX_BIO_LENGTH;

  const { isDirty, dirtyFields, isValid } = useFormState({
    control: form.control,
  });

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
      // * Here, we replace the url with the user's updated username if it is changed
      // Here we invalidate the query key 'freelancer' which is what the 'user' prop is.
      // If the user changes his/her username, we still want to update our cache with the new username data
      if (dirtyFields.handle) {
        router.replace(`/${handle}`);
      }
      queryClient.invalidateQueries({ queryKey: ['freelancer', handle] });
      // Also invalidate the dashboard data (TODO: this is a hacky fix until we have more generic communication with the parent component)
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
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
            className='flex flex-col gap-5'
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
                className='text-textSecondary flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border-[1px] border-[#D0D5DD] px-3 py-2 text-sm font-semibold'
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
                  <Trash className='h-5 w-5' />
                </div>
              )}
            </div>
            <FormField
              control={form.control}
              name='handle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-textSecondary text-sm font-medium'>
                    Handle
                  </FormLabel>
                  <FormControl>
                    <HandleInput
                      name={field.name}
                      register={form.register}
                      setValue={form.setValue}
                      error={errors.handle}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex w-full flex-row gap-6'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-textSecondary text-sm font-medium'>
                      First name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...form.register('firstName')}
                        placeholder='First name'
                        {...field}
                        className='text-textPlaceholder w-full focus:outline-none focus:ring-0'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-textSecondary text-sm font-medium'>
                      Last name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...form.register('lastName')}
                        placeholder='Last name'
                        {...field}
                        className='text-textPlaceholder focus:outline-none focus:ring-0'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='city'
              render={() => (
                <FormItem>
                  <FormLabel className='text-textSecondary'>
                    Where are you located?
                  </FormLabel>
                  <FormControl>
                    <LocationInput
                      register={form.register}
                      setValue={form.setValue}
                      name='city'
                      className='text-textPlaceholder'
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
                  <FormLabel className='text-textSecondary'>
                    Create a short bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className='border-1 text-textPlaceholder mt-1 w-full resize-none rounded-lg border border-[#D0D5DD] p-3 text-base font-normal focus:outline-none focus:ring-0 focus-visible:ring-transparent'
                      placeholder='A few words about yourself'
                      rows={4}
                      {...form.register('bio')}
                      defaultValue={user?.bio}
                    />
                  </FormControl>
                  <BioMessage isMax={isMaxBioLength} length={bioLength} />
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
              disabled={loading || !isDirty || !isValid}
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
