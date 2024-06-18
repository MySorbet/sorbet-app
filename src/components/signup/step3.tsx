'use client';

import { FormContainer } from '../signin';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SkillBadge } from './skill-badge';
import { Search } from 'lucide-react';
import { useState } from 'react';

const Step3 = () => {
  const [skill, setSkill] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([
    'React',
    'Node.js',
    'TypeScript',
    'GraphQL',
    'MongoDB',
  ]);

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
              (skills.length > 0 ? 'py-[10px] px-[14px]' : 'px-[14px]')
            }
          >
            <div className='flex h-full items-center'>
              <Search className='h-5 w-5 text-[#667085]' />
            </div>
            <div className='flex flex-col'>
              <div className='skills flex gap-[3px] flex-wrap w-full'>
                {skills.map((current) => (
                  <SkillBadge key={current} skill={current} />
                ))}
              </div>
              <div className='w-full'>
                <Input className='border-none bg-inherit focus:outline-none' />
              </div>
            </div>
          </div>
          <h3 className="text-sm font-normal text-[#344054]'">Max 5 skills</h3>
        </div>
        <div className='flex gap-3'>
          <Button className='bg-[#FFFFFF] border border-[#D0D5DD] shadow-sm shadow-[#1018280D] text-[#344054] font-semibold text-base'>
            Back
          </Button>
          <Button className='w-full text-white bg-[#573DF5] border border-[#7F56D9] shadow-sm shadow-[#1018280D] font-semibold text-base'>
            Create Profile
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export { Step3 };
