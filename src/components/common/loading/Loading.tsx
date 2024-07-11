import { Loader } from 'lucide-react';
import React from 'react';

export const Loading: React.FC = () => (
  <div className='flex justify-center items-center bg-gray-300 bg-opacity-70 fixed inset-0 z-50'>
    <Loader className='animate-spin' size={48} stroke={`#573DF5`} />
  </div>
);
