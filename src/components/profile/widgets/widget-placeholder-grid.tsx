import React from 'react';

import { WidgetPlaceholder } from './widget-placeholder';

interface WidgetPlaceholderGridProps {
  /** Callback for when any placeholder is clicked */
  onClick?: () => void;
}

// TODO: Could tweak the grid properties with tw breakpoints to support smaller screen sizes
/**
 * Grid of widget placeholders for the profile page. Lays out a bento grid of placeholders to match design.
 *
 * Note: this grid maintains a 2:1 ratio intentionally to size placeholders correctly. It will fill its container's width up to a reasonable max width.
 */
export const WidgetPlaceholderGrid: React.FC<WidgetPlaceholderGridProps> = ({
  onClick,
}) => {
  return (
    <div className='animate-in fade-in grid aspect-[2/1] w-full max-w-screen-2xl grid-cols-4 grid-rows-2 gap-8'>
      <WidgetPlaceholder
        type='TwitterProfile'
        className='col-span-1 row-span-1'
        onClick={onClick}
      />
      <WidgetPlaceholder
        type='Dribbble'
        className='col-span-1 row-span-2'
        onClick={onClick}
      />
      <WidgetPlaceholder
        type='Behance'
        className='col-span-2 row-span-1'
        onClick={onClick}
      />
      <WidgetPlaceholder
        type='LinkedInProfile'
        className='col-span-1 row-span-1'
        onClick={onClick}
      />
      <WidgetPlaceholder
        type='InstagramProfile'
        className='col-span-1 row-span-1'
        onClick={onClick}
      />
      <WidgetPlaceholder
        type='SpotifySong'
        className='col-span-1 row-span-1'
        onClick={onClick}
      />
    </div>
  );
};
