import { ImageOff } from 'lucide-react';

import { Spinner } from '@/components/common/spinner';
import { TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ImageWidgetProps {
  /** The url of the image to display. If not provided, the widget will display an error state. */
  contentUrl?: string;
  /** Additional classes to apply to the widget. */
  className?: string;
  /** Whether the widget is loading (image upload in progress). If true, the widget will display a spinner. */
  loading?: boolean;
}

/**
 * Full bleed image widget. To be rendered by a higher up widget component.
 */
export const ImageWidget: React.FC<ImageWidgetProps> = ({
  contentUrl,
  className,
  loading,
}) => {
  return (
    <div
      className={cn(
        'relative size-full overflow-hidden rounded-2xl',
        className
      )}
    >
      {contentUrl ? (
        <>
          <img
            src={contentUrl}
            alt='Photo content'
            className='size-full object-cover'
          />
          {loading && <Spinner className='absolute left-4 top-4' />}
        </>
      ) : (
        <div className='bg-muted flex size-full items-center justify-center'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ImageOff className='text-muted-foreground size-8' />
              </TooltipTrigger>
              <TooltipContent className='max-w-56'>
                Something isn't right with this image. Delete it and try again.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};
