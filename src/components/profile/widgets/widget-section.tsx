import React, { useState } from 'react'; // Import useState for managing title state

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SectionTitleWidgetProps {
  title: string;
  editMode: boolean;
  updateTitle: (title: string) => void;
}

export const SectionTitleWidget: React.FC<SectionTitleWidgetProps> = ({
  title,
  editMode,
  updateTitle,
}) => {
  const [editableTitle, setEditableTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  console.log('editMode', editMode);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(e.target.value);
  };

  /** When user stops interacting with the title input area, update in the backend */
  const handleTitleBlur = async () => {
    setIsEditing(false);
    if (editableTitle !== title) {
      await updateTitle(editableTitle);
    }
  };

  return (
    <div
      className={cn(
        `my-2 flex h-full w-full items-center rounded-3xl transition-colors duration-300`,
        isEditing ? 'bg-white' : editMode ? 'hover:bg-white' : ''
      )}
      onClick={() => {
        if (editMode) setIsEditing(true);
      }} // Enable editing on click if user is signed-in
    >
      {isEditing ? (
        <Input
          type='text'
          value={editableTitle}
          placeholder='Add a Title'
          onChange={handleTitleChange}
          onBlur={handleTitleBlur} // Update on blur
          autoFocus
          className='ml-1 text-3xl font-semibold'
          variant='noBorderOrRing'
          disabled={!editMode}
        />
      ) : (
        <div
          className={cn(
            `ml-2 rounded-2xl px-2 py-2 text-3xl font-semibold`,
            !editableTitle ? 'text-muted-foreground' : 'text-[#344054]',
            editMode ? 'hover:bg-[#D9D9D9]' : ''
          )}
        >
          {editableTitle || 'Add a Title'}
        </div>
      )}
    </div>
  );
};
