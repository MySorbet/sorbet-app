import { type FC, useState } from 'react';

import { EditProfileSheet } from '@/components/profile/edit-profile-sheet';
import { cn } from '@/lib/utils';
import { User } from '@/types';

import { ProfileHeader } from './profile-header';
import { WidgetGrid } from './widgets/widget-grid';

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
  const [isEditProfileOpen, setProfileOpen] = useState(false);
  const handleProfileEdit = () => setProfileOpen((prev) => !prev);
  const handleSetProfileOpen = (open: boolean) => setProfileOpen(open);

  return (
    <div className='w-full max-w-7xl'>
      <div className='flex flex-col items-center gap-4 py-6'>
        <ProfileHeader
          user={user}
          onEditClick={handleProfileEdit}
          canEdit={canEdit}
          onHireMeClick={onHireMeClick}
          disableHireMe={disableHireMe}
          hideShare={hideShare}
        />
        <EditProfileSheet
          open={isEditProfileOpen}
          setOpen={handleSetProfileOpen}
          user={user}
        />
      </div>

      <div className={cn('mt-10', canEdit && 'mb-10')}>
        <WidgetGrid editMode={canEdit} userId={user.id} />
      </div>
    </div>
  );
};
