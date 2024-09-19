import { type FC, useState } from 'react';

import { cn } from '@/lib/utils';
import { User } from '@/types';

import { ProfileEditModal } from './profile-edit-modal';
import { ProfileHeader } from './profile-header';
import { WidgetContainer } from './widgets/widget-container';

export const Profile: FC<{
  user: User;
  canEdit?: boolean;
  onHireMeClick?: () => void;
  disableHireMe?: boolean;
  hideShare?: boolean;
}> = ({
  user,
  canEdit = false,
  onHireMeClick,
  disableHireMe = false,
  hideShare = false,
}) => {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const handleProfileEdit = () => {
    setShowEditModal((prev) => !prev);
  };

  const handleProfileModalVisible = (open: boolean) => {
    setShowEditModal(open);
  };

  return (
    <div className='container mx-auto py-4'>
      <div className='flex flex-col items-center gap-4 py-6'>
        <ProfileHeader
          user={user}
          onEditClick={handleProfileEdit}
          canEdit={canEdit}
          onHireMeClick={onHireMeClick}
          disableHireMe={disableHireMe}
          hideShare={hideShare}
        />
        <ProfileEditModal
          editModalVisible={showEditModal}
          handleModalVisible={handleProfileModalVisible}
          user={user}
        />
      </div>

      <div className={cn('mt-12', canEdit && 'mb-24')}>
        <WidgetContainer editMode={canEdit} userId={user.id} />
      </div>
    </div>
  );
};
