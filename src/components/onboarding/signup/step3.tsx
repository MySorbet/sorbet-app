'use client';

import { Loader } from 'lucide-react';

import SkillInput from '@/components/syntax-ui/skill-input';
import { Button } from '@/components/ui/button';
import { useAuth, useUpdateUser, useUploadProfileImage } from '@/hooks';

import { FormContainer } from '../form-container';
import { useUserSignUp } from './signup';

const Step3 = () => {
  const { userData, setUserData, setStep } = useUserSignUp();
  const { user } = useAuth();

  const { isPending: uploadPending, mutateAsync: uploadProfileImage } =
    useUploadProfileImage();
  const { isPending: updatePending, mutate: updateUser } = useUpdateUser();

  const handleSkillChange = (newSkills: string[]) => {
    setUserData({ ...userData, skills: newSkills });
  };

  if (!user) throw new Error('User not found');

  // TODO: Extract this to a function or hook
  const handleCreateProfile = async () => {
    const userToUpdate = {
      ...user,
      ...userData,
      city: userData.location,
      tags: userData.skills,
    };

    if (
      user.id &&
      userData.image !== user.profileImage &&
      userData.file !== undefined
    ) {
      const imageFormData = new FormData();
      imageFormData.append('file', userData.file);
      imageFormData.append('fileType', 'image');
      imageFormData.append('destination', 'profile');
      imageFormData.append('oldImageUrl', user?.profileImage ?? '');
      imageFormData.append('userId', user?.id);

      await uploadProfileImage({
        imageFormData,
        userToUpdate,
      });
    }

    await updateUser(userToUpdate);
    setStep(4);
  };

  return (
    <FormContainer>
      <div className='flex h-full flex-col justify-between gap-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex w-full items-center justify-between'>
            <h1 className='text-2xl font-semibold'>Skills</h1>
            <p className='text-sm font-medium text-[#344054]'>Step 3 of 3</p>
          </div>
          <SkillInput
            initialSkills={userData.skills}
            onSkillsChange={handleSkillChange}
            unique
          />
        </div>
        <div className='flex gap-3'>
          <Button
            className='border border-[#D0D5DD] bg-[#FFFFFF] text-base font-semibold text-[#344054] shadow-sm shadow-[#1018280D] hover:bg-gray-300'
            onClick={() => setStep(2)}
          >
            Back
          </Button>
          <Button
            className='w-full border border-[#7F56D9] bg-[#573DF5] text-base font-semibold text-white shadow-sm shadow-[#1018280D]'
            onClick={handleCreateProfile}
          >
            {updatePending || uploadPending ? (
              <Loader className='animate animate-spin' />
            ) : (
              'Create Profile'
            )}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export { Step3 };
