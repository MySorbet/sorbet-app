import { useState } from 'react';
import { toast } from 'sonner';

import { uploadProfileImageAsync } from '@/api/images';
import { useAuth, useUpdateUser } from '@/hooks';

export const useAvatarUpload = () => {
  const { user } = useAuth();
  const { mutateAsync: updateUser } = useUpdateUser({ toastOnSuccess: false });
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = async (file: File) => {
    if (!user?.id) {
      toast.error('User not found');
      return;
    }

    // Validate file size
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      toast.error('File must be JPEG, PNG, or WebP');
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to GCS
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', file.type);
      formData.append('destination', 'profile');
      formData.append('userId', user.id);
      if (user.profileImage) {
        formData.append('oldImageUrl', user.profileImage);
      }

      const response = await uploadProfileImageAsync(formData);
      const imageUrl = response.data?.fileUrl ?? response.data?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned from upload');
      }

      // Update user with new profile image
      await updateUser({ id: user.id, profileImage: imageUrl });

      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleAvatarChange,
    isUploading,
  };
};

