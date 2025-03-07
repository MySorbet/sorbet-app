import { ImageIcon } from 'lucide-react';

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
  onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
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
              onChange={onAdd}
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
