import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { UploadIcon } from 'lucide-react';
import { toast } from 'sonner';

import { uploadPOA } from '@/api/bridge/bridge';
import {
  checkFileValid,
  MAX_FILE_SIZE_MB,
} from '@/app/(with-sidebar)/verify/components/utils';
import {
  Dropzone,
  DropzoneEmptyState,
  renderBytes,
  useDropzoneContext,
} from '@/components/ui/kibo-ui/dropzone';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// TODO -- this is a duplicate of verify page constant
export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/heic': ['.heic'],
  'image/tiff': ['.tif'],
};

/** Dropzone for uploading a proof of address */
export const PoaDropzone = ({ className }: { className?: string }) => {
  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (checkFileValid(file)) {
      upload(file);
    } else if (acceptedFiles) {
      toast.error(`The document must be less than ${MAX_FILE_SIZE_MB}MB`);
    }
  };

  // TODO: Render an uploading state in the dropzone
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
    <Dropzone
      maxSize={1024 * 1024 * MAX_FILE_SIZE_MB}
      onDrop={handleDrop}
      onError={(error) => {
        console.error(error);
        toast.error('Error uploading file', {
          description: error.message,
        });
      }}
      accept={ACCEPTED_FILE_TYPES}
      className={className}
    >
      <DropzoneEmptyState>
        <PoaDropzoneEmptyState />
      </DropzoneEmptyState>
    </Dropzone>
  );
};

export const PoaDropzoneEmptyState = () => {
  const { maxSize, accept } = useDropzoneContext();
  return (
    <div
      className={cn(
        'flex max-w-prose flex-col items-center justify-center gap-2'
      )}
    >
      <div className='bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md'>
        <UploadIcon size={16} />
      </div>
      <p className='w-full truncate text-wrap text-base font-semibold'>
        Upload a proof of address
      </p>
      <p className='text-muted-foreground w-full truncate text-wrap text-sm font-normal'>
        To verify your address, <strong>drag and drop or click</strong> to
        upload a recent document issued within the last 90 days that shows your
        name and current address
      </p>

      <Tooltip>
        <TooltipTrigger>
          <p className='text-sorbet-lighter text-sm underline-offset-2 hover:underline focus-visible:underline'>
            Example Documents
          </p>
        </TooltipTrigger>
        <TooltipContent className='max-w-prose'>
          <div className='px-3'>
            <strong>Your document should</strong>
            <ul className='list-outside list-disc'>
              <li>confirm your current residential address</li>
              <li>be addressed to you</li>
              <li>be issued in the last 90 days</li>
              <li>not be a PO box or virtual addresses</li>
            </ul>
            <br />
            <strong>Examples include</strong>
            <ul className='list-outside list-disc'>
              <li>Bank statement</li>
              <li>Utility bill</li>
              <li>Government-issued letter</li>
              <li>Government issued ID (issued in the last 90 days)</li>
              <li>Lease agreement (current but may be older than 90 days)</li>
            </ul>
            <br />
            <strong>Accepted file types</strong>
            <br />
            Your file must be less than {renderBytes(maxSize ?? 0)}
            {accept && (
              <>
                {' '}
                and one of{' '}
                <span className='font-mono'>
                  {new Intl.ListFormat('en', { type: 'disjunction' }).format(
                    Object.values(accept).flat()
                  )}
                </span>
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
