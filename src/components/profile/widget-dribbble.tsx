import { DribbbleWidgetContentType } from '@/types';
import React from 'react';

interface DribbbleWidgetType {
  content: DribbbleWidgetContentType;
}

export const DribbbleWidget: React.FC<DribbbleWidgetType> = ({ content }) => {
  return (
    <div className='relative h-full rounded-xl flex justify-center items-center'>
      <img
        src={content.image}
        alt='Dribbble content'
        className='max-w-full max-h-full rounded-xl'
      />
    </div>
  );
};
