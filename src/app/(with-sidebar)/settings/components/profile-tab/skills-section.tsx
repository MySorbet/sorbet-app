'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { SETTINGS_CONFIG } from '../../constants';
import type { ProfileFormData } from '../../schemas';
import { SettingsSection } from '../settings-section';

export const SkillsSection = () => {
  const form = useFormContext<ProfileFormData>();
  const [searchValue, setSearchValue] = useState('');
  const skills = form.watch('tags') || [];

  const handleAddSkill = (skill: string) => {
    if (
      !skill.trim() ||
      skills.includes(skill.trim()) ||
      skills.length >= SETTINGS_CONFIG.tags.max
    ) {
      return;
    }
    form.setValue('tags', [...skills, skill.trim()], { shouldDirty: true });
    setSearchValue('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    form.setValue(
      'tags',
      skills.filter((s) => s !== skillToRemove),
      { shouldDirty: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(searchValue);
    }
  };

  const filteredSuggestions = SETTINGS_CONFIG.tags.suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(searchValue.toLowerCase()) &&
      !skills.includes(suggestion)
  );

  return (
    <SettingsSection
      label='Skills'
      description='Add maximum 5 skills to your profile'
    >
      <FormField
        name='tags'
        control={form.control}
        render={() => (
          <FormItem className='w-full max-w-md'>
            <FormLabel>Skills</FormLabel>
            <FormControl>
              <div className='space-y-3'>
                <div className='relative'>
                  <Search className='text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2' />
                  <Input
                    placeholder={SETTINGS_CONFIG.tags.placeholder}
                    className='pl-9'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={skills.length >= SETTINGS_CONFIG.tags.max}
                  />
                </div>

                {/* Suggestions */}
                {searchValue && filteredSuggestions.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {filteredSuggestions.slice(0, 5).map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant='outline'
                        className='hover:bg-accent cursor-pointer'
                        onClick={() => handleAddSkill(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Selected skills */}
                {skills.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {skills.map((skill) => (
                      <Badge key={skill} variant='secondary'>
                        {skill}
                        <button
                          type='button'
                          onClick={() => handleRemoveSkill(skill)}
                          className='hover:text-destructive ml-1'
                          aria-label={`Remove ${skill}`}
                        >
                          <X className='size-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <p className='text-muted-foreground mt-1 text-xs'>
              Add max {SETTINGS_CONFIG.tags.max} skills
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </SettingsSection>
  );
};
