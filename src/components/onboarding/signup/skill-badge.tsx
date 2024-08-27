'use client';

import { Badge } from '../../ui/badge';
import { X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type SkillBadgeProps = {
  skill: string;
  setSkills: Dispatch<SetStateAction<string[]>>;
  removeSkill?: () => void;
};

const SkillBadge = ({ skill, setSkills, removeSkill }: SkillBadgeProps) => {
  const handleRemoveSkill = () => {
    setSkills((skills) => {
      return skills.filter((s) => s !== skill);
    });
  };

  return (
    <Badge
      color='blue'
      className='flex h-6 grow-0 items-center gap-[3px] rounded-[6px] border border-[#D0D5DD] bg-white py-[2px] pl-1 pr-[5px] hover:bg-white'
    >
      <p className='text-sm text-[#344054]'>{skill}</p>
      <button onClick={removeSkill ? removeSkill : handleRemoveSkill}>
        <X className='h-3 w-3 text-[#98A2B3]' />
      </button>
    </Badge>
  );
};

export { SkillBadge };
