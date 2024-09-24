import React from 'react';

import { NoWidgetsSocialsDisplay } from './no-widgets-socials';

/**
 * Content shown to a profile owner when there are no widgets present.
 */
export const NoWidgetsContent = () => {
  return (
    <div className='flex h-40 flex-1 items-center justify-center rounded-3xl bg-[#FFFFFF]'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <h1 className='text-base font-medium text-[#344054]'>
          Start by adding links from your favorite sites
        </h1>
        <NoWidgetsSocialsDisplay />
      </div>
    </div>
  );
};
