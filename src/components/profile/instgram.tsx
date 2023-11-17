/* eslint-disable @next/next/no-img-element */

const Instgram = () => {
  return (
    <div className='border-gray-default flex w-[225px] flex-col items-start gap-[23px] rounded-2xl border-[0.75px] p-3'>
      <div className='flex w-full items-start justify-between gap-[9px]'>
        <div className='flex flex-col items-start gap-1'>
          <div className='flex items-center gap-1'>
            <img src='/avatar.svg' alt='avatar' width={19} height={18} />
            <div className='text-black-600/80 text-sm font-medium leading-6'>
              @namegoeshere
            </div>
          </div>
          <div className='flex items-start gap-4 text-xs font-normal leading-6'>
            <div>
              134 <span className='opacity-60'>Followers</span>
            </div>
            <div>
              45 <span className='opacity-60'>Posts</span>
            </div>
          </div>
        </div>
        <img
          src='/images/social/instgram.png'
          alt='instgram'
          width={24}
          height={24}
        />
      </div>
      <div className='grid grid-cols-3 gap-1 rounded-lg'>
        <img src='/images/profile/instgram/bg-1.png' alt='bg-1' />
        <img src='/images/profile/instgram/bg-2.png' alt='bg-2' />
        <img src='/images/profile/instgram/bg-3.png' alt='bg-3' />
        <img src='/images/profile/instgram/bg-4.png' alt='bg-4' />
        <img src='/images/profile/instgram/bg-5.png' alt='bg-5' />
        <img src='/images/profile/instgram/bg-6.png' alt='bg-6' />
        <img src='/images/profile/instgram/bg-7.png' alt='bg-7' />
        <img src='/images/profile/instgram/bg-8.png' alt='bg-8' />
        <img src='/images/profile/instgram/bg-9.png' alt='bg-9' />
      </div>
    </div>
  );
};

export default Instgram;
