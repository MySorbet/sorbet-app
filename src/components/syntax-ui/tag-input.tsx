import { SkillBadge } from '@/components/onboarding/signup/skill-badge';
import { cn } from '@/lib/utils';
import { SearchLg, X } from '@untitled-ui/icons-react';
import React, { useState } from 'react';

interface KeywordsInputProps {
  initialKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  unique: boolean;
}

const TagInput = ({
  initialKeywords,
  onKeywordsChange,
  unique = false,
}: KeywordsInputProps) => {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [inputValue, setInputValue] = useState<string>('');

  const isMaxSkills = keywords.length >= 5;

  // Handles adding new keyword on Enter or comma press, and keyword removal on Backspace
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === 'Enter' ||
      event.key === ',' ||
      (event.key === 'Tab' && inputValue.trim() !== '')
    ) {
      if (inputValue.trim() === '' || isMaxSkills) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      const newKeywords = unique
        ? [...new Set([...keywords, inputValue.trim()])]
        : [...keywords, inputValue.trim()];
      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
      setInputValue('');
    } else if (event.key === 'Backspace' && inputValue === '') {
      event.preventDefault();
      const newKeywords = keywords.slice(0, -1);
      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
    }
  };

  // Handles pasting keywords separated by commas, new lines, or tabs
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const paste = event.clipboardData.getData('text');
    const allwords = paste.split(', ').map((word) => word.trim());
    const newallwords = allwords.slice(0, 5);
    const strippedArr = newallwords.join(', ');

    const keywordsToAdd = strippedArr
      .split(/[\n\t,]+/)
      .map((keyword) => keyword.trim())
      .filter(Boolean);
    if (keywordsToAdd.length) {
      const newKeywords = unique
        ? [...new Set([...keywords, ...keywordsToAdd])]
        : [...keywords, ...keywordsToAdd];
      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
      setInputValue('');
    }
  };

  // Updates the inputValue state as the user types
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  // Adds the keyword when the input loses focus, if there's a keyword to add
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim() !== '' && event.relatedTarget?.tagName !== 'BUTTON') {
      const newKeywords = [...keywords, inputValue.trim()];
      setKeywords(newKeywords);
      onKeywordsChange(newKeywords);
      setInputValue('');
    }
  };

  // Removes a keyword from the list
  const removeKeyword = (indexToRemove: number) => {
    const newKeywords = keywords.filter((_, index) => index !== indexToRemove);
    setKeywords(newKeywords);
    onKeywordsChange(newKeywords);
  };

  return (
    <div className='flex w-full flex-wrap items-center rounded-lg border p-2'>
      <div
        className='flex w-full flex-wrap items-center gap-2 overflow-y-auto'
        style={{ maxHeight: '300px' }}
      >
        <SearchLg className='h-5 w-5 text-[#667085]' />

        {initialKeywords.map((keyword, index) => (
          <SkillBadge
            key={index}
            skill={keyword}
            setSkills={setKeywords}
            removeSkill={() => removeKeyword(index)}
          />
        ))}
        <input
          type='text'
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={(e) => handleBlur(e)}
          className={cn(
            isMaxSkills && 'cursor-not-allowed bg-inherit',
            'my-1 flex-1 text-sm outline-none'
          )}
          placeholder={`Enter your skills here`}
        />
      </div>
    </div>
  );
};

export default TagInput;
