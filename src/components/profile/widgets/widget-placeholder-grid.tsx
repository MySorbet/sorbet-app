import React from 'react';

import { cn } from '@/lib/utils';

import { WidgetPlaceholder } from './widget-placeholder';

interface WidgetPlaceholderGridProps {
  /** Callback for when any placeholder is clicked */
  onClick?: () => void;
  /** Whether the grid is loading */
  loading?: boolean;
  /** Additional className to apply to the grid */
  className?: string;
}

// TODO: Could tweak the grid properties with tw breakpoints to support smaller screen sizes
/**
 * Grid of widget placeholders for the profile page. Lays out a bento grid of placeholders to match design.
 *
 * Note: this grid maintains a 2:1 ratio intentionally to size placeholders correctly. It will fill its container's width up to a reasonable max width.
 */
export const WidgetPlaceholderGrid: React.FC<WidgetPlaceholderGridProps> = ({
  onClick,
  loading,
  className,
}) => {
  return (
    <div
      className={cn(
        'animate-in fade-in grid aspect-[2/1] w-full max-w-screen-2xl grid-cols-4 grid-rows-2 gap-8',
        className
      )}
    >
      <WidgetPlaceholder
        type='TwitterProfile'
        className={cn('col-span-1 row-span-1', loading && 'bg-slate-200')}
        onClick={onClick}
        loading={loading}
      />
      <WidgetPlaceholder
        type='Dribbble'
        className={cn('col-span-1 row-span-2', loading && 'bg-slate-200')}
        onClick={onClick}
        loading={loading}
      />
      <WidgetPlaceholder
        type='Behance'
        className={cn('col-span-2 row-span-1', loading && 'bg-slate-200')}
        onClick={onClick}
        loading={loading}
      />
      <WidgetPlaceholder
        type='LinkedInProfile'
        className={cn('col-span-1 row-span-1', loading && 'bg-slate-200')}
        onClick={onClick}
        loading={loading}
      />
      <WidgetPlaceholder
        type='InstagramProfile'
        className={cn('col-span-1 row-span-1', loading && 'bg-slate-200')}
        onClick={onClick}
        loading={loading}
      />
      <WidgetPlaceholder
        type='SpotifySong'
        className={cn('col-span-1 row-span-1', loading && 'bg-slate-200')}
        onClick={onClick}
        loading={loading}
      />
    </div>
  );
};
