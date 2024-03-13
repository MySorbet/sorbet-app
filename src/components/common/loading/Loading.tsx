import { Loader } from 'lucide-react';
import React from 'react';

export const Loading: React.FC = () => (
  <div className='flex justify-center items-center bg-gray-700 bg-opacity-40 fixed inset-0 z-50'>
    <Loader className='animate-spin' size={36} />
  </div>
);
