'use client';

import { Loader } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

import SkillInput from '@/components/syntax-ui/skill-input';
import { Button } from '@/components/ui/button';
import { useAuth, useUpdateUser, useUploadProfileImage } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { User } from '@/types';

import { FormContainer } from '../form-container';
import { UserSignUpContext, UserSignUpContextType } from './signup';

const Step3 = () => {
  const { userData, setUserData, setStep } = useContext(
    UserSignUpContext
  ) as UserSignUpContextType;
  const { user: authUser } = useAuth();
  const reduxUser = useAppSelector((state) => state.userReducer.user);
  const [user, setUser] = useState(authUser || reduxUser);

  const isMaxSkills = userData.skills.length >= 5;

  const { isPending: uploadPending, mutateAsync: uploadProfileImage } =
    useUploadProfileImage();
  const { isPending: updatePending, mutate: updateUser } = useUpdateUser();

  const handleSkillChange = (newSkills: string[]) => {
    setUserData({ ...userData, skills: newSkills });
  };
  const handleCreateProfile = async () => {
    let userToUpdate: User = { ...user };

    if (
      user?.id &&
      userData.image !== user?.profileImage &&
      userData.file !== undefined
    ) {
      const imageFormData = new FormData();
      imageFormData.append('file', userData.file);
      imageFormData.append('fileType', 'image');
      imageFormData.append('destination', 'profile');
      imageFormData.append('oldImageUrl', user?.profileImage);
      imageFormData.append('userId', user?.id);

      await uploadProfileImage({
        imageFormData,
        userToUpdate,
      });
    }

    if (user) {
      userToUpdate = {
        ...userToUpdate,
        firstName: userData.firstName,
        lastName: userData.lastName,
        city: userData.location,
        tags: userData.skills,
        bio: userData.bio,
      };

      updateUser(userToUpdate);
      setStep(4);
    }
  };

  useEffect(() => {
    setUser(authUser || reduxUser);
  }, [authUser, reduxUser]);

  return (
    <FormContainer>
      <div className='flex h-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Skills</h1>
          <p className='text-sm font-medium text-[#344054]'>Step 3 of 3</p>
        </div>
        <div className='flex flex-1 flex-col gap-2'>
          <h1 className="text-[#344054]' text-sm font-medium">
            Add your skills
          </h1>
          <SkillInput
            initialSkills={userData.skills}
            onSkillsChange={handleSkillChange}
            unique
          />
          {isMaxSkills && (
            <h3 className="text-[#344054]' text-sm font-normal">
              Max 5 skills
            </h3>
          )}
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
            {updatePending || uploadPending ? <Loader /> : 'Create Profile'}
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export { Step3 };
