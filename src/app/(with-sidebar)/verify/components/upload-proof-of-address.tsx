import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

import { uploadPOA } from '@/api/bridge/bridge';
import { InvisibleInput } from '@/app/[handle]/components/control-bar/invisible-input';
import { Spinner } from '@/components/common/spinner';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { ACCEPTED_FILE_TYPES, checkFileValid, MAX_FILE_SIZE_MB } from './utils';

/** Button providing a file input for uploading a proof of address */
export const UploadProofOfAddress = () => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (checkFileValid(file)) {
      upload(file);
    } else if (file) {
      toast.error(`The document must be less than ${MAX_FILE_SIZE_MB}MB`);
    }
  };

  const { mutate: upload, isPending } = useMutation({
    mutationFn: (file: File) => uploadPOA(file),
    onSuccess: () => {
      toast.success('Proof of address uploaded');
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data.message
        : error.message;
      console.error(message);
      toast.error('Error uploading file', {
        description: message,
      });
    },
  });

  return (
    <InvisibleInput
      handleInputChange={handleChange}
      disabled={isPending}
      inputProps={{
        accept: ACCEPTED_FILE_TYPES.map((ext) => `.${ext}`).join(','),
      }}
      className={cn(buttonVariants({ variant: 'secondary' }), 'w-fit')}
    >
      {isPending ? <Spinner /> : <Upload aria-hidden='true' />}
      {isPending ? 'Uploading...' : 'Upload proof of address'}
    </InvisibleInput>
  );
};
