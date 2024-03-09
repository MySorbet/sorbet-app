import { Loader } from 'lucide-react';
import React from 'react';

export const Loading = () => {
  return (
    <div className='fixed inset-0 bg-gray-500 bg-opacity-70 flex justify-center items-center'>
      <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-[#22252a]'></div>
    </div>
  );
};
