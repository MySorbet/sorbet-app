import { CircleAlert, X } from 'lucide-react';
import React from 'react';

interface InvalidAlertProps {
  handleAlertVisible: (status: boolean) => void;
}

export const InvalidAlert: React.FC<InvalidAlertProps> = ({
  handleAlertVisible,
}) => {
  return (
    <div className='flex flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200 cursor-pointer'>
      <div>
        <div className='p-1 border border-red-100 rounded-full border-2'>
          <div className='p-1 border border-red-300 rounded-full border-2'>
            <CircleAlert className='w-6 h-6' color={`red`} />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <p className='font-semibold'>Link not supported</p>
        <p className='mt-2'>We only support the following links:</p>
        <p className='font-semibold'>
          Dribble, Behance, Spotify, Instagram, Soundcloud, Youtube, Medium,
          Substack.
        </p>
        <div className='flex flex-row gap-3 mt-2 cursor-pointer'>
          <div
            className='hover:underline'
            onClick={() => handleAlertVisible(false)}
          >
            Dismiss
          </div>
          <div className='hover:underline text-sorbet font-semibold'>
            Learn More
          </div>
        </div>
      </div>
      <div>
        <X
          className='w-6 h-6'
          color={`gray`}
          onClick={() => handleAlertVisible(false)}
        />
      </div>
    </div>
  );
};
