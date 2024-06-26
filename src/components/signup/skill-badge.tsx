'use client';

import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type SkillBadgeProps = {
  skill: string;
  setSkills: Dispatch<SetStateAction<string[]>>;
};

const SkillBadge = ({ skill, setSkills }: SkillBadgeProps) => {
  const handleRemoveSkill = () => {
    setSkills((skills) => {
      return skills.filter((s) => s !== skill);
    });
  };

  return (
    <Badge
      color='blue'
      className='flex items-center grow-0 gap-[3px] h-6 rounded-[6px] bg-white border border-[#D0D5DD] py-[2px] pl-1 pr-[5px] hover:bg-white'
    >
      <p className='text-[#344054] text-sm'>{skill}</p>
      <button onClick={handleRemoveSkill}>
        <X className='h-3 w-3 text-[#98A2B3]' />
      </button>
    </Badge>
  );
};

export { SkillBadge };
