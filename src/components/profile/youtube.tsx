const Youtube = () => {
  return (
    <div className='border-gray-default relative flex h-[300px] w-[450px] flex-col items-center justify-center justify-self-stretch rounded-2xl border-[0.75px] bg-[#1F1F1F] p-3'>
      <img
        src='/images/test/youtube-bg.png'
        alt='youtube'
        className='h-[373px] w-[373px] overflow-hidden'
      />
      <div className='absolute w-full left-3 top-3 inline-flex items-center gap-1'>
        <img src='/avatar.svg' alt='avatar' width={24} height={24} />
        <div className='text-sm font-medium leading-6 text-white opacity-80'>
          Title goes here
        </div>
        <img
          src='/images/profile/play-video.svg'
          alt='play-video'
          className='absolute w-6 right-[124px]'
        />
      </div>
      <img
        src='/images/profile/play-video.svg'
        alt='play-video'
        className='absolute w-[60px]'
      />
    </div>
  );
};

export default Youtube;
