'use client';

import { Loading02 } from '@untitled-ui/icons-react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth, useUpdateUser, useUploadProfileImage } from '@/hooks';

import { FormContainer } from '../form-container';
import { useUserSignUp } from './signup';
import { SkillBadge } from './skill-badge';

const Step3 = () => {
  const { userData, setUserData, setStep } = useUserSignUp();
  const [skill, setSkill] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const { user } = useAuth();
  const { isPending: uploadPending, mutateAsync: uploadProfileImage } =
    useUploadProfileImage();
  const { isPending: updatePending, mutate: updateUser } = useUpdateUser();

  if (!user) throw new Error('User not found');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (skill.length == 0) return;
      const copy = skills.slice();
      setSkills((skills) => [...skills, skill]);
      const updatedCopy = [...copy, skill];
      setUserData((data) => ({ ...data, skills: updatedCopy }));
      setSkill('');
    }
  };

  // TODO: Extract this to a function or hook
  const handleCreateProfile = async () => {
    const userToUpdate = {
      ...user,
      ...userData,
      city: userData.location,
      tags: skills,
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

    console.log('userToUpdate', userToUpdate);
    await updateUser(userToUpdate);
    setStep(4);
  };
  useEffect(() => {
    setSkills(userData.skills);
  }, [userData.skills]);

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
          <div
            className={
              'skills-container flex w-full gap-1 rounded-[8px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D]  ' +
              (skills.length > 0 ? 'px-[14px] pt-[10px]' : 'px-[14px]')
            }
          >
            <div className='flex h-full items-center'>
              <Search className='h-5 w-5 text-[#667085]' />
            </div>
            <div className='flex flex-col'>
              <div className='skills flex w-full flex-wrap gap-[3px] '>
                {skills.map((current) => (
                  <SkillBadge
                    key={current}
                    skill={current}
                    setSkills={setSkills}
                  />
                ))}
              </div>
              <div className='flex w-full items-center '>
                <input
                  value={skill}
                  className='h-11 border-none bg-inherit p-0 pl-1 text-sm focus:outline-none '
                  placeholder='Add skills here'
                  onKeyDown={(e) => handleKeyDown(e)}
                  onChange={(e) => setSkill(e.target.value)}
                />
              </div>
            </div>
          </div>
          <h3 className="text-[#344054]' text-sm font-normal">Max 5 skills</h3>
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
              <Loading02 className='animate animate-spin' />
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
