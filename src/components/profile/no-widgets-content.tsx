import { NoWidgetsSocialsDisplay } from './no-widgets-socials.';
import React from 'react';

const NoWidgetsContent = () => {
  return (
    <div className='bg-[#FFFFFF] rounded-3xl'>
      <div>
        <h1 className='text-base font-medium text-[#344054]'>
          Start by adding links from your favorite sites
        </h1>
        <NoWidgetsSocialsDisplay />
      </div>
    </div>
  );
};

export { NoWidgetsContent };
