import { ExternalLink, ImageOff } from 'lucide-react';

import { Spinner } from '@/components/common/spinner';
import { TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ImageWidgetProps {
  /** The url of the image to display. If not provided, the widget will display an error state. */
  contentUrl?: string;
  /** Where the image should link to. Optional. */
  href?: string;
  /** Additional classes to apply to the widget. */
  className?: string;
  /** Whether the widget is loading (image upload in progress). If true, the widget will display a spinner. */
  loading?: boolean;
}

// TODO: Is it semantically ok to have an anchor for the root even if there is no href?

/**
 * Full bleed image widget. To be rendered by a higher up widget component.
 *
 * Renders a div if there is no href, or an anchor if there is a href.
 */
export const ImageWidget: React.FC<ImageWidgetProps> = ({
  contentUrl,
  href,
  className,
  loading,
}) => {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      draggable={false}
      className={cn(
        'relative block size-full overflow-hidden rounded-2xl',
        className
      )}
    >
      {contentUrl ? (
        <>
          <img
            src={contentUrl}
            alt='Photo content'
            className='size-full object-cover'
            draggable={false}
          />
          {loading && <Spinner className='absolute left-3 top-3' />}
          {href && (
            <ExternalLink className='bg-background/40 absolute right-3 top-3 size-5 rounded-sm p-1 backdrop-blur-sm' />
          )}
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
    </a>
  );
};
