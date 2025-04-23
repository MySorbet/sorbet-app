import { ImageIcon } from 'lucide-react';

import {
  handleImageInputChange,
  validImageExtensionsWithDots,
} from '@/components/profile/widgets/util';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { InvisibleInput } from './invisible-input';

// TODO: Make sure this is accessible, has the right role, etc.
// TODO: Is the input nested within a label really the best approach here?

/** A button that acts as a file input to accept images */
export const AddImageButton = ({
  onAdd,
}: {
  onAdd?: (image: File) => void;
}) => {
  const handleChange = onAdd ? handleImageInputChange(onAdd) : undefined;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <InvisibleInput
          handleInputChange={handleChange}
          inputProps={{ accept: validImageExtensionsWithDots.join(',') }}
          className={cn(
            // TODO: These styles are duplicates of the ControlBarIconButton, but we need to apply them to the label for this to work. Any options?
            buttonVariants({ variant: 'secondary' }),
            'h-fit cursor-pointer border border-[#E5E7EB] p-1 transition-transform hover:scale-110'
          )}
        >
          <ImageIcon aria-hidden='true' />
        </InvisibleInput>
      </TooltipTrigger>
      <TooltipContent>Add an image</TooltipContent>
    </Tooltip>
  );
};
