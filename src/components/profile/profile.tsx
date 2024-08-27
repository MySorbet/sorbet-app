import { type FC, useState } from 'react';

import {
  ProfileEditModal,
  ProfileHeader,
  WidgetContainer,
} from '@/components/profile';
import { cn } from '@/lib/utils';
import { User } from '@/types';

export const Profile: FC<{
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
      {user && (
        <div className='flex flex-col items-center gap-4 py-6'>
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
        </div>
      )}

      {user && (
        <div className={cn('mt-12', canEdit ? 'mb-24' : '')}>
          <WidgetContainer editMode={canEdit} userId={user.id} />
        </div>
      )}
    </div>
  );
};
