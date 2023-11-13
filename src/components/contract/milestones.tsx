import Image from 'next/image';

interface props {
  contract: number,
  onChangeContract: any
}

const Milestones = ({ contract, onChangeContract }: props) => {
  return (
    <div className='flex h-full flex-col items-start justify-between gap-4 px-4 pt-4'>
      <div className='flex flex-col justify-start'>
        <div className='self-strech flex flex-col gap-0.5'>
          <div className='self-strech flex items-center gap-1'>
            <img
              src='/svg/milestone.svg'
              alt='milestone'
              width={24}
              height={24}
            />
            <div className='text-[20px] font-semibold leading-tight'>
              Milestones
            </div>
          </div>
          <div className='self-strech flex justify-start text-sm font-medium leading-snug text-[#595B5A]'>
            Create a contract and be paid automatically when milestones are
            reached
          </div>
        </div>
        <div className='self-strech flex flex-col py-4'>
          <div className='flex gap-4 p-2'>
            <div className='h-5 w-5 rounded-full bg-[#D7D7D7]'></div>
            <div className='text-xs font-normal leading-5 text-[#595B5A]'>
              Milestone 1
            </div>
          </div>
          <div className='flex pl-4'>
            <div className='h-4 w-0.5 bg-[#D9D9D9]'></div>
          </div>
          <div className='flex gap-4 p-2'>
            <div className='h-5 w-5 rounded-full bg-[#D7D7D7]'></div>
            <div className='text-xs font-normal leading-5 text-[#595B5A]'>
              Milestone 2
            </div>
          </div>
          <div className='flex pl-4'>
            <div className='h-4 w-0.5 bg-[#D9D9D9]'></div>
          </div>
          <div className='flex gap-4 p-2'>
            <div className='h-5 w-5 rounded-full bg-[#D7D7D7]'></div>
            <div className='text-xs font-normal leading-5 text-[#595B5A]'>
              Milestone 3
            </div>
          </div>
        </div>
      </div>
      <div className='w-full py-4'>
        <button className='w-full items-center justify-end rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white' onClick={onChangeContract}>
          Create contract
        </button>
      </div>
    </div>
  );
};

export default Milestones;
