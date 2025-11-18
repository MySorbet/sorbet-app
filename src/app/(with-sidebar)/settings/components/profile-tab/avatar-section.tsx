'use client';

import { Upload } from 'lucide-react';
import { useRef } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { SettingsSection } from '../settings-section';

interface AvatarSectionProps {
  /** Current avatar URL */
  currentAvatar?: string;
  /** User initials for fallback */
  initials?: string;
  /** Callback when avatar file is selected */
  onAvatarChange: (file: File) => void;
  /** Whether upload is in progress */
  isUploading?: boolean;
}

export const AvatarSection = ({
  currentAvatar,
  initials = '?',
  onAvatarChange,
  isUploading = false,
}: AvatarSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  return (
    <SettingsSection
      label='Avatar'
      description='Avatar displayed as your profile image'
    >
      <div
        className='flex items-center gap-4 border-b'
        style={{
          width: '466px',
          height: '88px',
          paddingTop: '4px', // spacing/6
          paddingBottom: '4px', // spacing/6
        }}
      >
        {/* Avatar */}
        <Avatar
          className='rounded-full'
          style={{
            width: '40px',
            height: '40px',
          }}
        >
          <AvatarImage src={currentAvatar} alt='Profile avatar' />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        {/* Upload Button */}
        <Button
          variant='outline'
          size='default'
          type='button'
          onClick={handleUploadClick}
          disabled={isUploading}
          className='gap-2 rounded-md px-1 py-2'
          style={{
            width: '104px',
            height: '36px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E4E4E7',
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Upload className='size-4' />
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/jpeg,image/png,image/webp'
          onChange={handleFileChange}
          className='hidden'
          aria-label='Upload avatar'
        />
      </div>
    </SettingsSection>
  );
};