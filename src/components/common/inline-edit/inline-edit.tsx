import React, { useState } from 'react';

import { cn } from '@/lib/utils';

interface InlineEditProps {
  /** The current value to display/edit */
  value: string;
  /** Callback when the value changes and is saved */
  onChange?: (value: string) => void;
  /** Whether editing is allowed */
  editable?: boolean;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional className for the container */
  className?: string;
}

export const InlineEdit = ({
  value,
  onChange,
  editable = false,
  placeholder,
  className,
}: InlineEditProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange && editValue !== value) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (editable) {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  // Update local state when prop value changes
  React.useEffect(() => {
    setEditValue(value);
  }, [value]);

  return (
    <div
      onClick={handleClick}
      className={cn(editable && 'cursor-text', className)}
    >
      {editable && isEditing ? (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
          className='w-full border-none bg-transparent p-0 text-sm font-normal outline-none'
        />
      ) : (
        <span className='text-sm font-normal'>
          {value || (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
        </span>
      )}
    </div>
  );
};
