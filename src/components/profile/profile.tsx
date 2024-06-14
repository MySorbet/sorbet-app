import {
  ProfileHeader,
  ProfileEditModal,
  WidgetContainer,
} from '@/components/profile';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import React, { useState } from 'react';

export const Profile: React.FC<{
  user: User;
  canEdit?: boolean;
  onHireMeClick?: () => void;
  disableHireMe?: boolean;
}> = ({ user, canEdit = false, onHireMeClick, disableHireMe = false }) => {
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
        {user && (
          <>
            <ProfileHeader
              user={user}
              onEditClick={handleProfileEdit}
              canEdit={canEdit}
              onHireMeClick={onHireMeClick}
              disableHireMe={disableHireMe}
            />
            <ProfileEditModal
              editModalVisible={showEditModal}
              handleModalVisible={handleProfileModalVisible}
              user={user}
            />
          </>
        )}

        {user && (
          <div className={cn('mt-12', canEdit ? 'mb-24' : '')}>
            <WidgetContainer editMode={canEdit} userId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
};
