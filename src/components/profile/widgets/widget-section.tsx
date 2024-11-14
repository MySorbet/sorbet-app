import { Input } from '@/components/ui/input';
import React, { useState } from 'react'; // Import useState for managing title state

interface SectionTitleWidgetProps {
  title: string;
  updateTitle: any;
}

export const SectionTitleWidget: React.FC<SectionTitleWidgetProps> = ({
  title,
  updateTitle,
}) => {
  const [editableTitle, setEditableTitle] = useState(title); // State for editable title
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(e.target.value); // Update editable title state
  };

  const handleTitleBlur = async () => {
    setIsEditing(false); // Exit editing mode
    if (editableTitle !== title) {
      await updateTitle(editableTitle); // Update title in backend
    }
  };

  return (
    <div
      className={`flex h-full w-full items-center rounded-3xl transition-colors duration-300 ${
        isEditing ? 'bg-white' : 'hover:bg-white'
      }`}
      onClick={() => setIsEditing(true)} // Enable editing on click
    >
      {isEditing ? (
        <Input
          type='text'
          value={editableTitle}
          placeholder='Add a Title'
          onChange={handleTitleChange}
          onBlur={handleTitleBlur} // Update on blur
          autoFocus
          className='ml-1 text-3xl'
          variant={'noBorderOrRing'}
        />
      ) : (
        <div
          className={`ml-2 rounded-xl px-2 py-2 text-3xl hover:bg-[#D9D9D9] ${
            !editableTitle ? 'text-muted-foreground' : 'text-[#344054]'
          }`}
        >
          {editableTitle || 'Add a Title'}
        </div>
      )}
    </div>
  );
};
