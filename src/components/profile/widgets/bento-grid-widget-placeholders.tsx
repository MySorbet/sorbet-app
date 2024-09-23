import React from 'react';

import { WidgetPlaceHolder } from './widget-placeholder';

export const BentoGridWidgetPlaceholders: React.FC = () => {
  return (
    <div className='grid h-[720px] w-[1280px] grid-cols-4 grid-rows-2 gap-4 p-4'>
      <WidgetPlaceHolder
        type='TwitterProfile'
        size='A'
        className='col-span-1 row-span-1'
      />
      <WidgetPlaceHolder
        type='Dribbble'
        size='D'
        className='col-span-1 row-span-2'
      />
      <WidgetPlaceHolder
        type='Behance'
        size='A'
        className='col-span-2 row-span-1'
      />
      <WidgetPlaceHolder
        type='InstagramProfile'
        size='A'
        className='col-span-1 row-span-1'
      />
      <WidgetPlaceHolder
        type='InstagramProfile'
        size='A'
        className='col-span-1 row-span-1'
      />
      <WidgetPlaceHolder
        type='SpotifySong'
        size='A'
        className='col-span-1 row-span-1'
      />
    </div>
  );
};
