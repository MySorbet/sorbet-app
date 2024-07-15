import { WidgetHeader } from '@/components/profile/widgets/widget-header';
import { WidgetType } from '@/types';
import React from 'react';

export const DefaultWidget: React.FC = () => {
  return (
    <>
      <WidgetHeader type={WidgetType.Default} />
      <div className='bg-gray-200 p-3 relative h-full rounded-xl'></div>
    </>
  );
};
