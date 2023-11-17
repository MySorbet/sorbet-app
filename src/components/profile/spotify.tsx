/* eslint-disable @next/next/no-img-element */

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
        <div className='text-sm font-medium leading-6'>
          Ther Dark Side of the Moon
        </div>
        <div className='flex items-center gap-1 text-xs font-normal'>
          <div className='text-black-600/60 flex h-[18px] w-[18px] flex-col items-center justify-center gap-2.5 rounded-[2px] bg-[#D6D8DB]'>
            E
          </div>
          <div className='opacity-60'>Pink Floyd</div>
        </div>
      </div>
      <div className='mt-2 inline-flex items-center gap-3'>
        <div className='h-1 w-[117px] rounded-full bg-[#e1e2e6]'>
          <div className='h-1 w-6 rounded-full bg-[#6230EC]'></div>
        </div>
        <div className='flex items-center gap-1'>
          <img
            src='/images/profile/dots-horizontal.svg'
            alt='dots'
            className='h-6 w-6'
          />
          <img
            src='/images/profile/play-circle.svg'
            alt='play'
            className='h-11 w-11'
          />
        </div>
      </div>
    </div>
  );
};

export default Spotify;
