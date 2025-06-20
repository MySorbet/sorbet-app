import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

import { uploadPOA } from '@/api/bridge/bridge';
import { useEndorsements } from '@/app/(with-sidebar)/recipients/hooks/use-endorsements';
import { InvisibleInput } from '@/app/[handle]/components/control-bar/invisible-input';
import { InfoTooltip } from '@/components/common/info-tooltip/info-tooltip';
import { TaskItem } from '@/components/common/task-item/task-item';

import { ACCEPTED_FILE_TYPES, checkFileValid, MAX_FILE_SIZE_MB } from './utils';

/** Task Item providing a file input for uploading a proof of address */
export const UploadProofOfAddressStep = () => {
  const { isEurApproved } = useEndorsements();

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
    <>
      {/* Div is just to hack around mt not being applied to this element in its parent list */}
      <div />
      <InvisibleInput
        handleInputChange={handleChange}
        disabled={isPending}
        inputProps={{
          accept: ACCEPTED_FILE_TYPES.map((ext) => `.${ext}`).join(','),
        }}
      >
        <TaskItem
          completed={isEurApproved}
          loading={isPending}
          title={
            <span className='flex items-center gap-2'>
              Upload proof of address
              <InfoTooltip>
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
                    <li>
                      Lease agreement (current but may be older than 90 days)
                    </li>
                  </ul>
                </div>
              </InfoTooltip>
            </span>
          }
          description='Confirm your current residential address to unlock EUR recipients'
          Icon={Upload}
        />
      </InvisibleInput>
    </>
  );
};
