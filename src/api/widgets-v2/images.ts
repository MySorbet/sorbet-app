import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { uploadWidgetsImageAsync } from '@/api/images';

/**
 * Capture the legacy form data for uploading widget images
 */
export const buildLegacyFormData = (image: File) => {
  const fileExtension = image.name.split('.').pop()?.toLowerCase();
  const formData = new FormData();
  formData.append('file', image);

  // fileType must be different for svgs to render correctly
  if (fileExtension === 'svg') {
    formData.append('fileType', 'image/svg+xml');
  } else {
    formData.append('fileType', 'image');
  }
  formData.append('destination', 'widgets');
  formData.append('userId', '');

  return formData;
};

/**
 * Upload an `image` using the legacy API
 */
export const uploadWidgetImage = async (
  image: File,
  options?: {
    signal?: AbortSignal;
  }
): Promise<string | undefined> => {
  const formData = buildLegacyFormData(image);
  const response = await uploadWidgetsImageAsync(formData, options);
  if (response.data && response.data.fileUrl) {
    return response.data.fileUrl;
  } else {
    throw new Error('Widget image not uploaded');
  }
};

export const useUploadWidgetImage = () =>
  useMutation({
    mutationFn: uploadWidgetImage,
    onError: (error) => {
      if (!axios.isCancel(error)) {
        toast('Failed to upload widget image', {
          description: String(error),
        });
      }
    },
  });
