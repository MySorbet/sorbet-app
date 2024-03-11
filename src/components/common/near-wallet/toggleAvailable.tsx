import React, { Dispatch, SetStateAction } from 'react';

interface props {
  isAvailable: boolean;
  setIsAvailable: Dispatch<SetStateAction<boolean>>;
}

const ToggleAvailable = ({isAvailable, setIsAvailable}: props) => {

  return (
    <div className='flex items-start gap-2'>
      <div className={`w-10 h-5 relative rounded-full ${isAvailable ? 'pl-4 bg-[#7F56D9]' : 'bg-[#F2F4F7] pl-0.5'}`}>
        <div className='absoulte cursor-pointer h-5 w-5 rounded-full bg-white' onClick={() => setIsAvailable(!isAvailable)}></div>
      </div>
      <div>Available</div>
    </div>
  );
};

export default ToggleAvailable;
