'use client';

import { ImageIcon, ImageOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { InvisibleInput } from '@/app/[handle]/components/control-bar/invisible-input';
import { ControlButton } from '@/app/[handle]/components/widget/widget-controls/control-button';
import {
  validImageExtensions,
  validImageExtensionsWithDots,
} from '@/components/profile/widgets/util';
import { checkFileValid } from '@/components/profile/widgets/util';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ControlContainer } from './control-container';

/**
 * Controls for the preview image of a widget. Allowing delete, custom upload, and revert.
 */
export const PreviewControls = ({
  className,
  onUpload,
  onRevert,
  onDelete,
}: {
  className?: string;
  onUpload?: (image: File) => void;
  onRevert?: () => void;
  onDelete?: () => void;
}) => {
  // Could be props
  const showUpload = true;
  const showRevert = true;
  const showDelete = true;

  // TODO: Consider sharing this fn with control bar
  // Handle an image picked from the file system
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only support the first file (input should limit anyway)
    const file = e.target.files?.[0];
    if (checkFileValid(file)) {
      onUpload?.(file);
      e.target.value = '';
    } else {
      // This should only ever toast with 10mb error (since the input only accepts valid extensions)
      toast.error("We couldn't add this image", {
        description: `Images must be smaller than 10MB and be on the following formats: ${validImageExtensions.join(
          ', '
        )}`,
      });
    }
  };

  return (
    <ControlContainer className={className}>
      {showUpload && (
        <Tooltip>
          <TooltipTrigger asChild>
            <InvisibleInput
              handleInputChange={handleInputChange}
              inputProps={{ accept: validImageExtensionsWithDots.join(',') }}
              // TODO: These styles are duplication of ControlButton styles
              className='text-primary-foreground flex size-6 min-w-fit cursor-pointer items-center justify-center rounded-sm transition-colors hover:bg-[#D0ADFF]/30'
            >
              <ImageIcon className='size-4' />
            </InvisibleInput>
          </TooltipTrigger>
          <TooltipContent side='top' sideOffset={8}>
            <p>Upload custom image</p>
          </TooltipContent>
        </Tooltip>
      )}
      {showRevert && (
        <Tooltip>
          <TooltipTrigger asChild>
            <ControlButton onClick={onRevert}>
              <ImageOff className='size-4' />
            </ControlButton>
          </TooltipTrigger>
          <TooltipContent side='top' sideOffset={8}>
            <p>Use website preview</p>
          </TooltipContent>
        </Tooltip>
      )}
      {/* TODO: Could use a compact delete button, but need it be forwardRef and size 4 */}
      {showDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <ControlButton onClick={onDelete}>
              <Trash2 className='size-4' />
            </ControlButton>
          </TooltipTrigger>
          <TooltipContent side='top' sideOffset={8}>
            <p className='text-destructive'>Delete image</p>
          </TooltipContent>
        </Tooltip>
      )}
    </ControlContainer>
  );
};
