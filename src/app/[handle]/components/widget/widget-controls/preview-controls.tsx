'use client';

import { ImageIcon, Trash2, Undo2 } from 'lucide-react';

import { WidgetData } from '@/api/widgets-v2';
import { InvisibleInput } from '@/app/[handle]/components/control-bar/invisible-input';
import { useWidgets } from '@/app/[handle]/components/widget/use-widget-context';
import { ControlButton } from '@/app/[handle]/components/widget/widget-controls/control-button';
import {
  handleImageInputChange,
  validImageExtensionsWithDots,
} from '@/app/[handle]/util';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { ControlContainer } from './control-container';

/**
 * Controls for the preview image of a widget. Allowing delete, custom upload, and revert.
 * - Each action has a corresponding callback and a boolean to show/hide.
 */
export const PreviewControls = ({
  className,
  onUpload,
  onRevert,
  onDelete,
  showDelete,
  showRevert,
  showUpload,
}: {
  className?: string;
  onUpload?: (image: File) => void;
  onRevert?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  showRevert?: boolean;
  showUpload?: boolean;
}) => {
  const handleInputChange = onUpload
    ? handleImageInputChange(onUpload)
    : undefined;

  return (
    <ControlContainer className={className}>
      {showUpload && (
        <Tooltip>
          <TooltipTrigger
            asChild
            onMouseDown={(e) => {
              // Don't understand why, but this fixes a bug where
              // When a file is selected, or the file browser is closed, the tooltip is held open
              e.preventDefault();
            }}
          >
            <InvisibleInput
              handleInputChange={handleInputChange}
              inputProps={{ accept: validImageExtensionsWithDots.join(',') }}
              // TODO: These styles are duplication of ControlButton styles
              className='text-primary-foreground hover:bg-sorbet-lightest/30 flex size-6 min-w-fit cursor-pointer items-center justify-center rounded-sm transition-colors'
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
              <Undo2 className='size-4' />
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

/**
 * Connect Preview control UI to widget state and actions
 * - Hide and show actions based on the widget props this component receives
 * - Connect action callbacks to `useWidgets`
 * - Make sure to use within `WidgetContext`
 */
export const ConnectedPreviewControls = ({
  widget,
}: {
  widget: Partial<
    Pick<WidgetData, 'hideContent' | 'contentUrl' | 'userContentUrl'>
  > & { id: string };
}) => {
  const { hideContent, contentUrl, userContentUrl, id } = widget;
  const showDelete = Boolean(!hideContent && (contentUrl || userContentUrl));
  const showRevert = Boolean(
    (userContentUrl && contentUrl) || (contentUrl && hideContent)
  );
  const showUpload = true; // always can upload a new image

  const { updatePreview, updateWidget } = useWidgets();

  const handleUpload = (image: File) => updatePreview(id, image);
  const handleRevert = () =>
    updateWidget(id, {
      userContentUrl: null,
      hideContent: false,
    });
  const handleDelete = () =>
    updateWidget(id, {
      userContentUrl: null,
      hideContent: true,
    });

  return (
    <PreviewControls
      showDelete={showDelete}
      showRevert={showRevert}
      showUpload={showUpload}
      onUpload={handleUpload}
      onRevert={handleRevert}
      onDelete={handleDelete}
    />
  );
};
