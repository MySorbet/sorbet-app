import { cn } from '@/lib/utils';
import { WidgetDimensions, WidgetSize } from '@/types';

import { WidgetIcon, WidgetTypeWithIcon } from './widget-icon';

const multiplier = 100;

export const WidgetPlaceHolder = ({
  type,
  size,
  onClick,
}: {
  type: WidgetTypeWithIcon;
  size: WidgetSize;
  onClick?: () => void;
}) => {
  const d = WidgetDimensions[size];

  return (
    <div
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-[#D7D7D7] bg-white',
        `w-[${d.w * multiplier}px]`,
        `h-[${d.h * multiplier}px]` // Why does this not work?
      )}
      style={{
        height: d.h * multiplier,
      }}
      onClick={onClick}
    >
      <WidgetIcon type={type} className='mb-0 size-10' />
      <span className='text-lg font-medium text-[#667085]'>
        {widgetPlaceHolderText[type]}
      </span>
    </div>
  );
};

const widgetPlaceHolderText: Record<WidgetTypeWithIcon, string> = {
  Substack: 'Add Social',
  SpotifySong: 'Add Social',
  SpotifyAlbum: 'Add Social',
  SoundcloudSong: 'Add Social',
  InstagramPost: 'Add Social',
  InstagramProfile: 'Add Social',
  TwitterProfile: 'Add Social',
  LinkedInProfile: 'Add Social',
  Youtube: 'Add Social',
  Github: 'Add Social',
  Dribbble: 'Add Portfolio',
  Behance: 'Add Portfolio',
  Medium: 'Add Social',
  Figma: 'Add Portfolio',
};
