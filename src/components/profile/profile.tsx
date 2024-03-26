import {
  ProfileHeader,
  ProfileEditModal,
  WidgetContainer,
} from '@/components/profile';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export const Profile: React.FC = () => {
  const [editMode, setEditMode] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const handleProfileEdit = () => {
    setShowEditModal((prev) => !prev);
  };

  const handleProfileModalVisible = (open: boolean) => {
    setShowEditModal(open);
  };

  return (
    <div className='container mx-auto py-4'>
      <div className='flex flex-col gap-4'>
        <ProfileHeader
          avatar='https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop'
          username='0xHumza'
          fullName='Humza Khan'
          bio="Hello, I'm a Senior Product Engineer based in Montreal, Canada."
          tags={['Full Stack Development', 'Product Engineering', 'DevOps']}
          onEditClick={handleProfileEdit}
          editMode={editMode}
        />
        <ProfileEditModal
          editModalVisible={showEditModal}
          handleModalVisisble={handleProfileModalVisible}
        />
        <div className={cn('mt-24', editMode ? 'mb-24' : '')}>
          <WidgetContainer editMode={editMode} />
        </div>
      </div>
    </div>
  );
};
