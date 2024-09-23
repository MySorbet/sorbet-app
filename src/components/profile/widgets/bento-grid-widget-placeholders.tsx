import React from 'react';

import { WidgetPlaceHolder } from './widget-placeholder';

interface BentoGridWidgetPlaceholdersProps {
  /** Callback for when any placeholder is clicked */
  onClick?: () => void;
}

export const BentoGridWidgetPlaceholders: React.FC<
  BentoGridWidgetPlaceholdersProps
> = ({ onClick }) => {
  return (
    <div className='grid h-[720px] w-[1280px] grid-cols-4 grid-rows-2 gap-4 p-4'>
      <WidgetPlaceHolder
        type='TwitterProfile'
        size='A'
        className='col-span-1 row-span-1'
        onClick={onClick}
      />
      <WidgetPlaceHolder
        type='Dribbble'
        size='D'
        className='col-span-1 row-span-2'
        onClick={onClick}
      />
      <WidgetPlaceHolder
        type='Behance'
        size='A'
        className='col-span-2 row-span-1'
        onClick={onClick}
      />
      <WidgetPlaceHolder
        type='InstagramProfile'
        size='A'
        className='col-span-1 row-span-1'
        onClick={onClick}
      />
      <WidgetPlaceHolder
        type='InstagramProfile'
        size='A'
        className='col-span-1 row-span-1'
        onClick={onClick}
      />
      <WidgetPlaceHolder
        type='SpotifySong'
        size='A'
        className='col-span-1 row-span-1'
        onClick={onClick}
      />
    </div>
  );
};
