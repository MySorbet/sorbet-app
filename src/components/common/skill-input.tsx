import { SearchLg } from '@untitled-ui/icons-react';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';

import { SkillBadge } from '@/components/onboarding/signup/skill-badge';

interface SkillInputProps {
  skill: string;
  setSkill: Dispatch<SetStateAction<string>>;
  skills: string[];
  setSkills: Dispatch<SetStateAction<string[]>>;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Takes in a list of skills, a setter function to update the list of skills, and a function for keyboard events (`enter` and/or `tab`) to add a skill to the list of skills.
 */
export const SkillInput = ({
  skill,
  setSkill,
  skills,
  setSkills,
  handleKeyDown,
}: SkillInputProps) => {
  return (
    <div
      className={
        'skills-container flex w-full gap-1 rounded-[8px] border border-[#D0D5DD] shadow-sm shadow-[#1018280D]  ' +
        (skills.length > 0 ? 'px-[14px] pt-[10px]' : 'px-[14px]')
      }
    >
      <div className='flex h-full items-center'>
        <SearchLg className='h-5 w-5 text-[#667085]' />
      </div>
      <div className='flex flex-col'>
        <div className='skills flex w-full flex-wrap gap-[3px] '>
          {skills.map((current) => (
            <SkillBadge key={current} skill={current} setSkills={setSkills} />
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
  );
};
