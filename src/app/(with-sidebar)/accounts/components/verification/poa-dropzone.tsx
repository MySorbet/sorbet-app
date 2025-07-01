import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { UploadIcon } from 'lucide-react';
import { toast } from 'sonner';

import { uploadPOA } from '@/api/bridge/bridge';
import {
  ACCEPTED_FILE_TYPES_BY_MIME,
  checkFileValid,
  MAX_FILE_SIZE_MB,
} from '@/app/(with-sidebar)/verify/components/utils';
import { Spinner } from '@/components/common/spinner';
import {
  Dropzone,
  DropzoneEmptyState,
  renderBytes,
  useDropzoneContext,
} from '@/components/ui/kibo-ui/dropzone';
import { cn } from '@/lib/utils';

import {
  TooltipOrDrawer,
  TooltipOrDrawerContent,
  TooltipOrDrawerTrigger,
} from './tooltip-or-drawer';

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

  const handleError = (error: Error) => {
    console.error(error);
    const message = isAxiosError(error)
      ? error.response?.data.message
      : error.message;
    toast.error('Error uploading file', {
      description: message,
    });
  };

  const { mutate: upload, isPending } = useMutation({
    mutationFn: (file: File) => uploadPOA(file),
    onSuccess: () => {
      toast.success('Proof of address uploaded');
    },
    onError: handleError,
  });

  const maxBytes = 1024 * 1024 * MAX_FILE_SIZE_MB;

  return (
    <Dropzone
      maxSize={maxBytes}
      onDrop={handleDrop}
      onError={handleError}
      accept={ACCEPTED_FILE_TYPES_BY_MIME}
      className={className}
      disabled={isPending}
    >
      <DropzoneEmptyState>
        <PoaDropzoneEmptyState loading={isPending} />
      </DropzoneEmptyState>
    </Dropzone>
  );
};

export const PoaDropzoneEmptyState = ({ loading }: { loading?: boolean }) => {
  const { maxSize, accept } = useDropzoneContext();
  return (
    <div
      className={cn('flex max-w-sm flex-col items-center justify-center gap-2')}
    >
      <div className='bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md'>
        {loading ? <Spinner /> : <UploadIcon size={16} />}
      </div>
      <p className='w-full truncate text-wrap text-base font-semibold'>
        Upload a proof of address
      </p>
      <p className='text-muted-foreground w-full truncate text-wrap text-sm font-normal'>
        To verify your address, <strong>drag and drop or click</strong> to
        upload a document issued in the last 90 days that shows your name and
        current address
      </p>

      <TooltipOrDrawer>
        <TooltipOrDrawerTrigger
          // Prevent clicks from opening file picker
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <p className='text-sorbet-lighter text-sm underline-offset-2 hover:underline focus-visible:underline'>
            Example Documents
          </p>
        </TooltipOrDrawerTrigger>

        <TooltipOrDrawerContent
          tooltipContentProps={{ className: 'max-w-prose' }}
          drawerContentProps={{ className: 'px-3' }}
        >
          <div className='p-3'>
            <strong>Your document should</strong>
            <ul className='list-outside list-disc'>
              <li>Confirm your current residential address</li>
              <li>Be addressed to you</li>
              <li>Be issued in the last 90 days</li>
              <li>Not be a PO box or virtual addresses</li>
              {maxSize !== undefined && (
                <li>Be less than {renderBytes(maxSize)}</li>
              )}
              {accept && (
                <li>
                  {' '}
                  Be one of{' '}
                  <span className='font-mono text-xs'>
                    {new Intl.ListFormat('en', { type: 'disjunction' }).format(
                      Object.values(accept).flat()
                    )}
                  </span>
                </li>
              )}
            </ul>
            <br />
            <strong>Examples</strong>
            <ul className='list-outside list-disc'>
              <li>Bank statement</li>
              <li>Utility bill</li>
              <li>Government-issued letter</li>
              <li>Government issued ID (issued in the last 90 days)</li>
              <li>Lease agreement (current but may be older than 90 days)</li>
            </ul>
          </div>
        </TooltipOrDrawerContent>
      </TooltipOrDrawer>
    </div>
  );
};
