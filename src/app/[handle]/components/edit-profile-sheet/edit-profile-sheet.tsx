import { zodResolver } from '@hookform/resolvers/zod';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormState } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Spinner } from '@/components/common/spinner';
import SkillInput from '@/components/syntax-ui/skill-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SheetContent } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { MAX_BIO_LENGTH } from '@/constant';
import {
  useDeleteProfileImage,
  useUpdateUser,
  useUploadProfileImage,
} from '@/hooks';
import { useAfter } from '@/hooks/use-after';
import type { UserPublic } from '@/types';
import AvatarFallbackSVG from '~/svg/avatar-fallback.svg';

import { HandleInput, validateHandle } from '../claim-your-handle/handle-input';
import { BioMessage } from './bio-message';
import { LocationInput } from './location-input';

interface EditProfileSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: UserPublic;
}

// TODO: Match design
// TODO: Worth abstracting scrollable sheet?
// TODO: Component for profile image (and tab accessible)
// TODO: Use avatar fallback in more places

/**
 * A sheet allowing users to edit their profile details
 *
 * Originally based on the profile-edit-modal. Carries over a number of bad habits and tech debt.
 * However, no need to fix everything right now.
 */
export const EditProfileSheet: React.FC<EditProfileSheetProps> = ({
  open,
  setOpen,
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
    lastName: z.string().optional(),
    bio: z
      .string()
      .max(MAX_BIO_LENGTH, `Bio must be at most ${MAX_BIO_LENGTH} characters`)
      .optional(),
    city: z.string(),
    tags: z.array(z.string()).optional(),
    handle: validateHandle(user.handle),
    location: z.string().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isImageUpdated: false, // --> since image is not controlled by form, this allows us to stay within RHF for disabling the 'Save Changes' button.
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      bio: user?.bio ?? '',
      city: user?.city ?? '',
      tags: user?.tags ?? [],
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
    // Cant update a user that doesn't exist
    if (!user) {
      toast.error(
        'There was an issue updating your profile. Please try again.'
      );
      return;
    }

    // remove isImageUpdated from formData since it is not a user field
    const { isImageUpdated: _, ...newUserData } = formData;
    // Need to hang on to the old profile image
    let userToUpdate = {
      profileImage: user.profileImage,
      id: user.id,
    };

    // Case: user has a profile image and deleted it in the form, so we need to delete it from the db
    if (user.profileImage != null && image === undefined) {
      await deleteProfileImageAsync(user.id);
      if (deleteProfileImageError) return;
      userToUpdate.profileImage = '';
      // Case: user has a profile image and deleted it and selected a new image, so we need to upload the new image
    } else if (image !== user.profileImage && file !== undefined) {
      const imageFormData = new FormData();
      imageFormData.append('file', file);
      imageFormData.append('fileType', 'image');
      imageFormData.append('destination', 'profile');
      imageFormData.append('oldImageUrl', user.profileImage ?? '');
      imageFormData.append('userId', user.id);

      await uploadProfileImageAsync({
        imageFormData,
        userToUpdate,
      });
    }
    if (uploadProfileImageError) return;

    // Merge the updated form data with the data we were hanging on to
    userToUpdate = {
      ...userToUpdate,
      ...newUserData,
    };

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
    setOpen(false);
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

    // TODO: USe a ref
    const fileInput = document.getElementById(
      'profileImage'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // TODO: Better integration with the form
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
  }, [isSubmitSuccessful, user?.profileImage, form]);

  // Build a fn to clear the form after the sheet closes
  const clearForm = useAfter(() => {
    form.reset();
    setImage(user?.profileImage);
  }, 300);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    !open && clearForm();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className='flex h-full w-full flex-col justify-between gap-8 p-5'>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <VisuallyHidden asChild>
            <SheetDescription>Edit your profile information</SheetDescription>
          </VisuallyHidden>
        </SheetHeader>

        <ScrollArea className='h-full w-full'>
          <Form {...form}>
            <form
              id='edit-profile-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-1 flex-col gap-5 p-1'
            >
              <div className='flex items-center gap-2'>
                <Avatar className='size-10'>
                  <AvatarImage src={image} alt='new profile image' />
                  <AvatarFallback>
                    <AvatarFallbackSVG />
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
                    <FormLabel>Handle</FormLabel>
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
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder='First name' {...field} />
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
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder='Last name' {...field} />
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
                    <FormLabel>Location</FormLabel>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Create a short bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='A few words about yourself'
                        className='max-h-36 min-h-24 w-full resize-y'
                        {...field}
                      />
                    </FormControl>
                    <BioMessage isMax={isMaxBioLength} length={bioLength} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tags'
                render={({ field }) => (
                  <FormItem>
                    <SkillInput
                      initialSkills={user?.tags || []}
                      onSkillsChange={handleSkillChange}
                      unique
                      {...field}
                    />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter>
          <Button
            type='submit'
            form='edit-profile-form'
            variant='sorbet'
            className='w-full'
            disabled={loading || !isDirty || !isValid}
          >
            {loading && <Spinner />}
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
