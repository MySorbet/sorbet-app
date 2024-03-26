import { Input } from '@/components/ui/input';
import { useState, ChangeEvent } from 'react';

interface iTag {
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  maxTags: number;
  placeholder?: string;
  icon?: React.ReactNode;
}

export const InputTags = ({
  tags,
  addTag,
  removeTag,
  maxTags,
  icon,
  placeholder = 'Add a tag',
}: iTag) => {
  const [userInput, setUserInput] = useState<string>(' ');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (
        userInput.trim() !== '' &&
        userInput.length <= 12 &&
        tags.length < maxTags
      ) {
        addTag(userInput);
        setUserInput('');
      }
    }
  };

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-row gap-2 justify-center items-center border-1 border border-gray-300 rounded-xl'>
        <span className='ml-2 text-gray-500'>{icon && icon}</span>
        <Input
          name='keyword_tags'
          type='text'
          placeholder={
            tags.length < maxTags
              ? placeholder
              : `You can only enter max. of ${maxTags} tags`
          }
          className='w-full border-0 focus:outline-none'
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
          value={userInput}
          disabled={tags.length === maxTags}
        />
        <span></span>
      </div>

      <div className='flex flex-row flex-wrap mt-4 text-sm'>
        {tags.map((tag: string, index: number) => (
          <span
            key={`${index}-${tag}`}
            className='inline-flex items-start justify-start px-3 py-1 rounded-[32px] text-sm shadow-sm font-medium bg-sorbet text-white mr-1'
          >
            {tag}
            <button
              className='ml-2'
              onClick={() => removeTag(tag)}
              title={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
