import React from 'react';

import { WidgetPlaceholder } from './widget-placeholder';

interface WidgetPlaceholderGridProps {
  /** Callback for when any placeholder is clicked */
  onClick?: () => void;
}

/**
 * Grid of widget placeholders for the profile page. Lays out a bento grid of placeholders to match design.
 *
 * Note: this is a grid of 1280x640px (2:1 ratio) intentionally to size placeholders correctly.
 */
export const WidgetPlaceholderGrid: React.FC<WidgetPlaceholderGridProps> = ({
  onClick,
}) => {
  return (
    <div className='grid h-[640px] w-[1280px] grid-cols-4 grid-rows-2 gap-4 p-4'>
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
