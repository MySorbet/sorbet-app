import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  checkFileValid,
  validImageExtensions,
  validImageExtensionsWithDots,
} from '@/components/profile/widgets/util';
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
    // Only support the first file (input should limit anyway)
    const file = e.target.files?.[0];
    if (checkFileValid(file)) {
      onAdd?.(file);
    } else {
      // This should only ever toast with 10mb error (since the input only accepts valid extensions)
      toast.error('We couldn’t add this image', {
        description: `Images must be smaller than 10MB and be on the following formats: ${validImageExtensions.join(
          ', '
        )}`,
      });
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
              accept={validImageExtensionsWithDots.join(',')}
            />
            <ImageIcon aria-hidden='true' />
          </label>
        </TooltipTrigger>
        <TooltipContent>Upload custom image as widget</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
