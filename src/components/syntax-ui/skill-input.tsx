import { SearchLg } from '@untitled-ui/icons-react';
import {
  AnimatePresence,
  AnimationScope,
  motion,
  useAnimate,
} from 'framer-motion';
import { ComponentProps, MouseEvent, useState } from 'react';

import { SkillBadge } from '@/components/onboarding/signup/skill-badge';
import { MAX_CHARS_PER_SKILL, MAX_NUM_SKILLS } from '@/constant';

interface SkillInputProps extends ComponentProps<'input'> {
  initialSkills: string[];
  onSkillsChange: (skill: string[]) => void;
  unique: boolean;
}

/**
 * Takes in tag state and a function to update the state for the 'onChange' event
 * @param initialSkills - string[]
 * @param onSkillsChange - (skills: string[]) => void
 * @param unique - boolean - if true, only unique tags will be added
 * https://syntaxui.com/components/input
 */
const SkillInput = ({
  initialSkills,
  onSkillsChange,
  unique = false,
  ...props
}: SkillInputProps) => {
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [inputValue, setInputValue] = useState<string>('');
  const [scope, animate] = useAnimate();

  const isMaxSkills = skills.length >= MAX_NUM_SKILLS;
  const isMaxChars = inputValue.length > MAX_CHARS_PER_SKILL;

  // Handles adding new keyword on Enter or comma press, and keyword removal on Backspace
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === 'Enter' ||
      event.key === ',' ||
      (event.key === 'Tab' && inputValue.trim() !== '')
    ) {
      if (inputValue.trim() === '' || isMaxSkills || isMaxChars) {
        event.preventDefault();
        if (scope.current) {
          await animate(scope.current, { x: 20, y: 5, scale: 1.1 });
          await animate(scope.current, { x: 0, y: 0, scale: 1 });
        }
        return;
      }
      event.preventDefault();
      const newSkills = unique
        ? [...new Set([...skills, inputValue.trim()])]
        : [...skills, inputValue.trim()];
      setSkills(newSkills);
      onSkillsChange(newSkills);
      setInputValue('');
    } else if (event.key === 'Backspace' && inputValue === '') {
      event.preventDefault();
      const newSkills = skills.slice(0, -1);
      setSkills(newSkills);
      onSkillsChange(newSkills);
    }
  };

  // Handles pasting skills separated by commas, new lines, or tabs
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const paste = event.clipboardData.getData('text');
    const allwords = paste
      .split(', ')
      .map((word) => word.trim().slice(0, MAX_CHARS_PER_SKILL));
    const newallwords = allwords.slice(0, 5);
    const strippedArr = newallwords.join(', ');

    const keywordsToAdd = strippedArr
      .split(/[\n\t,]+/)
      .map((keyword) => keyword.trim())
      .filter(Boolean);
    if (keywordsToAdd.length) {
      const newSkills = unique
        ? [...new Set([...skills, ...keywordsToAdd])]
        : [...skills, ...keywordsToAdd];
      setSkills(newSkills);
      onSkillsChange(newSkills);
      setInputValue('');
    }
  };

  // Updates the inputValue state as the user types
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  // Adds the keyword when the input loses focus, if there's a keyword to add
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim() !== '' && event.relatedTarget?.tagName !== 'BUTTON') {
      const newSkills = [
        ...skills,
        inputValue.trim().slice(0, MAX_CHARS_PER_SKILL),
      ];
      setSkills(newSkills);
      onSkillsChange(newSkills);
      setInputValue('');
    }
  };

  // Removes a keyword from the list
  const removeKeyword = (
    event: MouseEvent<HTMLButtonElement>,
    indexToRemove: number
  ) => {
    const newSkills = skills.filter((_, index) => index !== indexToRemove);
    event.preventDefault();
    setSkills(newSkills);
    onSkillsChange(newSkills);
  };

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium text-[#344054]'>
        Add your skills
      </label>
      <div className='flex w-full flex-wrap items-center rounded-lg border p-2'>
        <div
          className='flex w-full flex-wrap items-center gap-2 overflow-y-auto'
          style={{ maxHeight: '300px' }}
        >
          <SearchLg className='h-5 w-5 text-[#667085]' />
          <AnimatePresence>
            {skills.map((keyword, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <SkillBadge
                  key={index}
                  skill={keyword}
                  onRemove={(event) => removeKeyword(event, index)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <input
            {...props}
            type='text'
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={(e) => handleBlur(e)}
            className='my-1 flex-1 bg-transparent text-sm outline-none'
            placeholder={`Enter your skills (max ${MAX_NUM_SKILLS})`}
          />
        </div>
      </div>
      <SkillStatus
        isMaxChars={isMaxChars}
        isMaxSkills={isMaxSkills}
        scope={scope}
      />
    </div>
  );
};

export default SkillInput;

const SkillStatus = ({
  isMaxSkills,
  isMaxChars,
  scope,
}: {
  isMaxSkills: boolean;
  isMaxChars: boolean;
  scope: AnimationScope<any>;
}) => {
  if (isMaxSkills) {
    return (
      <p
        ref={scope}
        className='animate-in slide-in-from-top-1 fade-in-0 text-destructive text-sm font-normal'
      >
        Max {MAX_NUM_SKILLS} skills
      </p>
    );
  }

  if (isMaxChars) {
    return (
      <p
        ref={scope}
        className='animate-in slide-in-from-top-1 fade-in-0 text-destructive text-sm font-normal'
      >
        Max {MAX_CHARS_PER_SKILL} characters per skill
      </p>
    );
  }
};
