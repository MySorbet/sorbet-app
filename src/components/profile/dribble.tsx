const Dribble = () => {
  return (
    <div className='border-gray-default flex h-[300px] w-[225px] flex-col items-start gap-[52px] rounded-2xl border-[0.75px] p-3'>
      <div className='flex w-full items-start justify-between'>
        <div className='text-sm font-medium leading-6'>Title goes here</div>
        <img
          src='/images/social/dribble.png'
          alt='dribble'
          width={24}
          height={24}
        />
      </div>
      <img
        src='/images/test/dribble-bg.png'
        alt='dribble-bg'
        className='w-full rounded-lg'
      />
    </div>
  );
};

export default Dribble;
