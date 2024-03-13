/* eslint-disable @next/next/no-img-element */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import UserType from '@/types/user';

type Props = {
  options: string[];
  placeholder?: string;
  onSelect: (value: string) => void;
  searchSkills: string[];
  setSearchSkills: Dispatch<SetStateAction<string[]>>;
};

const SearchBySkills: React.FC<Props> = ({
  options,
  placeholder,
  onSelect,
  searchSkills,
  setSearchSkills,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().startsWith(inputValue.toLowerCase())
      )
    );
  }, [inputValue, options]);

  useEffect(() => {
    if (inputValue !== '') {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [inputValue]);

  const handleOptionClick = (option: string) => {
    setInputValue('');
    setShowDropdown(false);
    onSelect(option);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  const removeSkillFromTags = (selectedSkill: string) => {
    setSearchSkills(
      searchSkills.filter((skill: string) => skill !== selectedSkill)
    );
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className='relative w-full flex-col items-start gap-2'>
      <div className='flex w-full flex-wrap justify-start gap-2 rounded-lg border bg-white border-[#D0D5DD] px-[14px] py-[10px]'>
        <img src='/images/search-lg.svg' alt='search' width={20} height={20} />
        {searchSkills &&
          searchSkills?.slice(0, 5).map((skill: string, i: number) => {
            return (
              <div
                key={i}
                className='flex cursor-default items-center justify-between gap-[2px] rounded-md border border-[#D0D5DD] p-1 text-sm font-medium text-[#344054] hover:opacity-50'
              >
                <div className='cursor-default'>
                  <span>{skill}</span>
                </div>
                <span
                  className='cursor-pointer text-xl '
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSkillFromTags(skill);
                  }}
                >
                  <img
                    src='/images/x-close.svg'
                    alt='close'
                    width={16}
                    height={16}
                  />
                </span>
              </div>
            );
          })}
        <input
          className='w-[200px] border border-none border-[#D0D5DD] p-0 text-base font-normal text-[#667085]'
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {showDropdown && (
        <div className='absolute mt-[-5px] max-h-24 w-full overflow-y-scroll rounded-md border border-gray-200 bg-white shadow-lg'>
          <ul className='justify-start'>
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className='cursor-pointer items-start justify-start p-2 hover:bg-gray-100'
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBySkills;
