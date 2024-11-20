import { X } from '@untitled-ui/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { Button } from '@/components/ui/button';

interface AccountModalProps {
  accountModalVisible: boolean;
  address: string | null;
  handleModalVisible: (open: boolean) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  accountModalVisible,
  address,
  handleModalVisible,
}) => {
  return (
    <Dialog open={accountModalVisible} onOpenChange={handleModalVisible}>
      <DialogContent
        className='p-8 sm:rounded-[32px]'
        hideDefaultCloseButton={true}
        aria-describedby={undefined}
      >
        <DialogTitle>
          <DialogHeader className='flex w-full flex-row items-start justify-between text-2xl font-semibold'>
            <p>USDC account</p>
            <X
              className='h-6 w-6 cursor-pointer text-[#98A2B3] transition ease-out hover:scale-110'
              onClick={() => handleModalVisible(false)}
            />
          </DialogHeader>
        </DialogTitle>
        <div className='mt-6 text-sm text-[#595B5A]'>
          Ethereum (Base) address
        </div>
        <div className='mb-4 flex items-center justify-center gap-2 rounded-xl border border-[#EFEFEF] p-3'>
          <div className='text-sm text-[#595B5A]'>{address}</div>
          <div className='ml-auto flex items-center justify-end'>
            <CopyIconButton
              copyIconClassName={'size-5 text-[#D0D5DD]'}
              checkIconClassName={'size-5'}
              onCopy={() => {
                navigator.clipboard.writeText(address);
              }}
            />
          </div>
        </div>
        <Button
          variant='outline'
          className='mt-4 h-10'
          onClick={() => handleModalVisible(false)}
        >
          <div>Done</div>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
