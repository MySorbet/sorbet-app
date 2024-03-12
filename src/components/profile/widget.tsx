import { getSocialIconForWidget } from '@/utils/icons';
import Image from 'next/image';
import React from 'react';

interface WidgetProps {
  key: number;
  type: string;
}

export const Widget: React.FC<WidgetProps> = ({ key, type }) => {
  return (
    <div
      className='bg-white p-3 flex flex-col rounded-xl w-full h-full relative'
      key={key}
    >
      <div className='mb-4'>
        <img
          src={getSocialIconForWidget(type)}
          alt={type}
          width={30}
          height={30}
        />
      </div>
      <div className='bg-gray-200 p-3 relative h-full rounded-xl'></div>
    </div>
  );
};
