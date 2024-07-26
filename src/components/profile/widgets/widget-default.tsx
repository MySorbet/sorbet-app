import { WidgetIcon } from '@/components/profile/widgets';
import { WidgetType } from '@/types';
import React from 'react';

export const DefaultWidget: React.FC = () => {
  return (
    <>
      <WidgetIcon type={WidgetType.Default} />
      <div className='bg-gray-200 p-3 relative h-full rounded-xl'></div>
    </>
  );
};