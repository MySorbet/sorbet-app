'use client';

import { X } from 'lucide-react';
import { MouseEventHandler } from 'react';

import { Badge } from '../../ui/badge';

type SkillBadgeProps = {
  skill: string;
  onRemove: MouseEventHandler<HTMLButtonElement>;
};

const SkillBadge = ({ skill, onRemove }: SkillBadgeProps) => {
  return (
    <Badge
      color='blue'
      className='flex h-6 grow-0 items-center gap-[3px] rounded-[6px] border border-[#D0D5DD] bg-white py-[2px] pl-1 pr-[5px] hover:bg-white'
    >
      <p className='text-sm text-[#344054]'>{skill}</p>
      <button onClick={onRemove}>
        <X className='h-3 w-3 text-[#98A2B3]' />
      </button>
    </Badge>
  );
};

export { SkillBadge };
