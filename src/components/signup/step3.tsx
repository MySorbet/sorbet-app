'use client';

import { FormContainer } from '../signin';
import { Button } from '../ui/button';
import { UserSignUpContext, UserSignUpContextType } from './signup-container';
import { SkillBadge } from './skill-badge';
import { useUpdateUser, useUploadProfileImage, useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { User } from '@/types';
import { Search, Loader } from 'lucide-react';
import { useState, useContext, useEffect } from 'react';

const Step3 = () => {
  const { userData, setUserData, setStep } = useContext(
    UserSignUpContext
  ) as UserSignUpContextType;
  const [skill, setSkill] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const { user: authUser } = useAuth();
  const reduxUser = useAppSelector((state) => state.userReducer.user);
  const [user, setUser] = useState(authUser || reduxUser);
  const { isPending: uploadPending, mutateAsync: uploadProfileImage } =
    useUploadProfileImage();
  const { isPending: updatePending, mutate: updateUser } = useUpdateUser();

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

  const handleCreateProfile = async () => {
    // Create user account via signup
    // Update user data
    // login with email to see if the login is successful
    // go to step 4
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
        tags: skills,
        bio: userData.bio,
      };

      updateUser(userToUpdate);
      setStep(4);
    }
  };
  useEffect(() => {
    setSkills(userData.skills);
  }, []);

  useEffect(() => {
    setUser(authUser || reduxUser);
  }, [authUser, reduxUser]);

  return (
    <FormContainer>
      <div className='flex flex-col gap-6 h-full'>
        <div className='flex w-full justify-between items-center'>
          <h1 className='font-semibold text-2xl'>Skills</h1>
          <p className='font-medium text-sm text-[#344054]'>Step 3 of 3</p>
        </div>
        <div className='flex flex-col flex-1 gap-2'>
          <h1 className="text-sm font-medium text-[#344054]'">
            Add your skills
          </h1>
          <div
            className={
              'skills-container flex border border-[#D0D5DD] shadow-sm shadow-[#1018280D] w-full rounded-[8px] gap-1  ' +
              (skills.length > 0 ? 'pt-[10px] px-[14px]' : 'px-[14px]')
            }
          >
            <div className='flex h-full items-center'>
              <Search className='h-5 w-5 text-[#667085]' />
            </div>
            <div className='flex flex-col'>
              <div className='skills flex gap-[3px] flex-wrap w-full '>
                {skills.map((current) => (
                  <SkillBadge
                    key={current}
                    skill={current}
                    setSkills={setSkills}
                  />
                ))}
              </div>
              <div className='flex items-center w-full '>
                <input
                  value={skill}
                  className='border-none bg-inherit focus:outline-none p-0 pl-1 text-sm h-11 '
                  placeholder='Add skills here'
                  onKeyDown={(e) => handleKeyDown(e)}
                  onChange={(e) => setSkill(e.target.value)}
                />
              </div>
            </div>
          </div>
          <h3 className="text-sm font-normal text-[#344054]'">Max 5 skills</h3>
        </div>
        <div className='flex gap-3'>
          <Button
            className='bg-[#FFFFFF] hover:bg-gray-300 border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[#344054] font-semibold text-base'
            onClick={() => setStep(2)}
          >
            Back
          </Button>
          <Button
            className='w-full text-white bg-[#573DF5] border border-[#7F56D9] shadow-sm shadow-[#1018280D] font-semibold text-base'
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
