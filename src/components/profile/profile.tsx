import {
  ProfileHeader,
  ProfileEditModal,
  WidgetContainer,
} from '@/components/profile';
import { useAuth } from '@/hooks';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export const Profile: React.FC = () => {
  const [editMode, setEditMode] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const { user } = useAuth();

  const handleProfileEdit = () => {
    setShowEditModal((prev) => !prev);
  };

  const handleProfileModalVisible = (open: boolean) => {
    setShowEditModal(open);
  };

  return (
    <div className='container mx-auto py-4'>
      <div className='flex flex-col gap-4'>
        {user && (
          <>
            <ProfileHeader
              user={user}
              onEditClick={handleProfileEdit}
              editMode={editMode}
            />
            <ProfileEditModal
              editModalVisible={showEditModal}
              handleModalVisisble={handleProfileModalVisible}
              user={user}
            />
          </>
        )}

        {user && (
          <div className={cn('mt-24', editMode ? 'mb-24' : '')}>
            <WidgetContainer editMode={editMode} />
          </div>
        )}
      </div>
    </div>
  );
};
