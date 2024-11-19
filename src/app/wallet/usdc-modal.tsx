import { X } from '@untitled-ui/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/common/copy-button/copy-button';

interface AccountModalProps {
  accountModalVisible: boolean;
  address: string;
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
        className='sm:rounded-[32px]'
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
        <div>Ethereum (Base) address</div>
        <div className='flex items-center gap-2 rounded-xl border border-[#EFEFEF] p-3'>
          <div>{address}</div>
          <div className='ml-auto justify-end'>
            <CopyButton
              stringToCopy='address'
              onCopy={() => {
                navigator.clipboard.writeText(address);
              }}
            />
          </div>
        </div>
        <Button
          className='h-6 w-6 cursor-pointer text-[#98A2B3] transition ease-out hover:scale-110'
          onClick={() => handleModalVisible(false)}
        >
          <div>Done</div>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
