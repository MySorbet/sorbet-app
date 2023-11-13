import { useState, useEffect } from 'react';

const Spotify = () => {
  return (
    <div className='border-gray-default flex w-[225px] flex-col items-start rounded-2xl border-[0.75px] p-3'>
      <div className='flex w-full items-start justify-between'>
        <img
          src='/images/test/spotify-bg.png'
          alt='spotify-bg'
          className='w-[104px] rounded-lg'
        />
        <img src='/images/social/spotify.png' alt='spotify' className='w-6' />
      </div>
      <div className='inline-flex flex-col items-start'>
        <div className='text-sm font-medium leading-6'>Ther Dark Side of the Moon</div>
        <div className='flex items-center text-xs gap-1 font-normal'>
          <div className='flex w-[18px] h-[18px] flex-col justify-center items-center text-black-600/60 gap-2.5 rounded-[2px] bg-[#D6D8DB]'>
            E
          </div>
          <div className='opacity-60'>Pink Floyd</div>
        </div>
      </div>
      <div className='inline-flex mt-2 items-center gap-3'>
        <div className='w-[117px] h-1 rounded-full bg-[#e1e2e6]'>
          <div className='w-6 h-1 rounded-full bg-[#6230EC]'></div>
        </div>
        <div className='flex items-center gap-1'>
          <img src='/images/profile/dots-horizontal.svg' alt='dots' className='w-6 h-6' />
          <img src='/images/profile/play-circle.svg' alt='play' className='w-11 h-11' />
        </div>
      </div>
    </div>
  );
};

export default Spotify;
