import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { WidgetIcon, WidgetTypeWithIcon } from './widget-icon';

interface WidgetPlaceholderProps {
  /** The type of the widget (controls icon and text*/
  type: WidgetTypeWithIcon;
  /** Callback when the placeholder is clicked */
  onClick?: () => void;
  /** Additional CSS class names for styling */
  className?: string;
  /** Whether the placeholder is loading */
  loading?: boolean;
}

// TODO: Rather than fill, should these maintain their own aspect based on a `WidgetSize`?
/**
 * Widget placeholder is used to show a placeholder for a widget when the user has not added any widgets to their profile.
 *
 * Note: will fill its container's width and height as it is expected to be rendered in RGL or CSS Grid.
 */
export const WidgetPlaceholder = ({
  type,
  onClick,
  className,
  loading,
}: WidgetPlaceholderProps) => {
  if (loading) {
    return (
      <Skeleton
        variant='darker' // Use the lighter variant since loading placeholders are rendered against a darker sorbet background in the profile
        className={cn('size-full min-h-28 min-w-28 rounded-3xl', className)}
      />
    );
  }
  return (
    <Button
      className={cn(
        'size-full min-h-fit min-w-fit flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-[#D7D7D7] bg-white p-8',
        className
      )}
      variant='outline'
      onClick={onClick}
    >
      <WidgetIcon type={type} className='mb-0 size-10' />
      <span className='text-lg font-medium text-[#667085]'>
        {widgetPlaceHolderText[type]}
      </span>
    </Button>
  );
};

/** Text to display for the placeholder */
const placeholderText = {
  social: 'Add Social',
  portfolio: 'Add Portfolio',
  music: 'Add Music',
};

/** Map of widget types to their placeholder text */
const widgetPlaceHolderText: Record<WidgetTypeWithIcon, string> = {
  Substack: placeholderText.social,
  SpotifySong: placeholderText.music,
  SpotifyAlbum: placeholderText.music,
  SoundcloudSong: placeholderText.music,
  InstagramPost: placeholderText.social,
  InstagramProfile: placeholderText.social,
  TwitterProfile: placeholderText.social,
  LinkedInProfile: placeholderText.social,
  Youtube: placeholderText.social,
  Github: placeholderText.social,
  Dribbble: placeholderText.portfolio,
  Behance: placeholderText.portfolio,
  Medium: placeholderText.social,
  Figma: placeholderText.portfolio,
};
