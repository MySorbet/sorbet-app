import { InputTags } from '@/components/common';
import { Input } from '@/components/ui/input';
import { useTagInput } from '@/hooks';
import type { User } from '@/types';
import { Search } from 'lucide-react';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
} from 'react';

interface InputSkillsProps {
  options: string[];
  placeholder?: string;
  onSelect: (value: string) => void;
  userEdit: User;
  setUserEdit: Dispatch<SetStateAction<User>>;
}

export const InputSkills: React.FC<InputSkillsProps> = ({
  options,
  placeholder,
  onSelect,
  userEdit,
  setUserEdit,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_TAGS = 5;
  const { tags, handleAddTag, handleRemoveTag } = useTagInput(MAX_TAGS);

  return (
    <div className='w-full flex flex-col gap-2 items-start'>
      <label className='text-sm font-medium text-[#344054]'>
        Add your skills
      </label>
      <InputTags
        tags={tags}
        addTag={handleAddTag}
        removeTag={handleRemoveTag}
        maxTags={MAX_TAGS}
        placeholder='Add skill and press enter'
        icon={<Search size={18} />}
      />
      <label className='text-sm font-normal text-[#475467]'>Max 5 skills</label>
    </div>
  );
};
