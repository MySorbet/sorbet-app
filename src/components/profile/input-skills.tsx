import { InputTags } from '@/components/common';
import { useTagInput } from '@/hooks';
import { Search } from 'lucide-react';
import React, { useEffect } from 'react';

interface InputSkillsProps {
  placeholder?: string;
  handleTagsChange: (values: string[]) => void;
}

export const InputSkills: React.FC<InputSkillsProps> = ({
  placeholder,
  handleTagsChange,
}) => {
  const MAX_TAGS = 5;
  const { tags, handleAddTag, handleRemoveTag } = useTagInput(MAX_TAGS);

  useEffect(() => {
    handleTagsChange(tags);
  }, [tags]);

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
        placeholder={placeholder}
        icon={<Search size={18} />}
      />
      <label className='text-sm font-normal text-[#475467]'>Max 5 skills</label>
    </div>
  );
};
