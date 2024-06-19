import { NoWidgetsSocialsDisplay } from './no-widgets-socials.';
import React from 'react';

const NoWidgetsContent = () => {
  return (
    <div className='bg-[#FFFFFF] rounded-3xl flex flex-1 items-center justify-center h-40'>
      <div className='flex flex-col gap-4 items-center justify-center'>
        <h1 className='text-base font-medium text-[#344054]'>
          Start by adding links from your favorite sites
        </h1>
        <NoWidgetsSocialsDisplay />
      </div>
    </div>
  );
};

export { NoWidgetsContent };
