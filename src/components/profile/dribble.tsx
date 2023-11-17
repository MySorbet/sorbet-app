/* eslint-disable @next/next/no-img-element */

const Dribble = () => {
  return (
    <div className='border-gray-default flex h-[300px] w-[225px] flex-col items-start gap-[52px] rounded-2xl border-[0.75px] p-3'>
      <div className='flex w-full items-start justify-between'>
        <div className='text-sm font-medium leading-6'>Title goes here</div>
        <img
          src='/images/social/dribble.png'
          alt='dribble'
          className='h-6 w-6'
          data-xblocker
        />
      </div>
      <img
        src='/images/test/dribble-bg.png'
        alt='dribble-bg'
        className='h-full w-full rounded-lg'
        data-xblocker
      />
    </div>
  );
};

export default Dribble;
