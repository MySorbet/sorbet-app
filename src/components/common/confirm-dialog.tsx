import { TriangleAlert } from 'lucide-react';
import React, { useEffect,useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpenExternally: boolean; // Added to allow external control
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  isOpenExternally, // Added to allow external control
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(isOpenExternally);
  }, [isOpenExternally]); // Effect to sync external state

  const closeDialog = () => setIsOpen(false);

  const handleConfirm = () => {
    onConfirm();
    closeDialog();
  };

  const handleCancel = () => {
    onCancel();
    closeDialog();
  };

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className='flex flex-col gap-4 justify-center items-center align-center'>
            <div>
              <TriangleAlert
                className='w-24 h-24'
                strokeWidth={1}
                stroke="#595C5A"
              />
            </div>
            <div className='text-3xl font-semibold'>{title}</div>
            <div className='px-8 text-lg text-center'>{description}</div>
            <div className='flex flex-row gap-2 w-full mt-12'>
              <AlertDialogCancel className='w-full' onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className='w-full bg-red-600'
                onClick={handleConfirm}
              >
                Confirm
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
