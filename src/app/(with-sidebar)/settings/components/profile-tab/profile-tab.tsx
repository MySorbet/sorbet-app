'use client';

import { AvatarSection } from './avatar-section';
import { BasicInfoSection } from './basic-info-section';
import { BioSection } from './bio-section';
import { HandleSection } from './handle-section';
import { SkillsSection } from './skills-section';

interface ProfileTabProps {
  /** Current avatar URL */
  currentAvatar?: string;
  /** User initials for avatar fallback */
  initials?: string;
  /** Callback when avatar is changed */
  onAvatarChange: (file: File) => void;
  /** Whether avatar upload is in progress */
  isUploadingAvatar?: boolean;
}

export const ProfileTab = ({
  currentAvatar,
  initials,
  onAvatarChange,
  isUploadingAvatar,
}: ProfileTabProps) => {
  return (
    <div className='flex w-full min-w-fit flex-col gap-6'>
      <AvatarSection
        currentAvatar={currentAvatar}
        initials={initials}
        onAvatarChange={onAvatarChange}
        isUploading={isUploadingAvatar}
      />
      <BasicInfoSection />
      <BioSection />
      <HandleSection />
      <SkillsSection />
    </div>
  );
};

