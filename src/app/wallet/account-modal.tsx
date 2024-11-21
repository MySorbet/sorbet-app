import { CopyIconButton } from '@/components/common/copy-button/copy-icon-button';
import { CloseButton } from '@/components/common/x-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AccountModalProps {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  address: string | null;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  handleOpenChange,
  address,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className='p-8 sm:rounded-[32px]'
        hideDefaultCloseButton={true}
        aria-describedby='Account info modal'
      >
        <DialogTitle>
          <DialogHeader className='flex w-full flex-row items-start justify-between text-2xl font-semibold'>
            <p>USDC account</p>
            <CloseButton
              onClick={() => handleOpenChange(false)}
              height={6}
              width={6}
            ></CloseButton>
          </DialogHeader>
        </DialogTitle>
        <div className='mt-6 text-sm text-[#595B5A]'>
          Ethereum (Base) address
        </div>
        <div className='mb-4 flex items-center justify-center gap-2 rounded-xl border border-[#EFEFEF] p-3'>
          <div className='text-sm text-[#595B5A]'>{address}</div>
          <div className='ml-auto flex items-center justify-end'>
            <CopyIconButton
              copyIconClassName='size-5 text-[#D0D5DD]'
              checkIconClassName='size-5'
              onCopy={() => {
                navigator.clipboard.writeText(address ?? '');
              }}
            />
          </div>
        </div>
        <Button
          variant='outline'
          className='mt-4 h-10'
          onClick={() => handleOpenChange(false)}
        >
          <div>Done</div>
        </Button>
      </DialogContent>
    </Dialog>
  );
};
