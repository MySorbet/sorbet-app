import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { checkFileValid } from '@/components/profile/widgets/util';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// TODO: Maybe this button should have a focus ring
// TODO: Make sure this is accessible, has the right role, etc.

/** A button that acts as a file input to accept images */
export const AddImageButton = ({
  onAdd,
}: {
  onAdd?: (image: File) => void;
}) => {
  // Handle an image picked from the file system
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Only support the first file (input should limit anyway)
    if (!file) return;
    if (checkFileValid(file)) {
      toast.success('Adding image...'); // TODO: Remove
      onAdd?.(file);
    } else {
      toast.error('Invalid image');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <label
            htmlFor='upload-image'
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'h-fit cursor-pointer p-1'
            )}
          >
            <input
              id='upload-image'
              type='file'
              className='hidden'
              onChange={handleInputChange}
              accept='image/*'
            />
            <ImageIcon aria-hidden='true' />
          </label>
        </TooltipTrigger>
        <TooltipContent>Upload custom image as widget</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
