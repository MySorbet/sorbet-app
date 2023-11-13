import Image from 'next/image';

interface props {
  contract: number;
  onChangeContract: any;
}

const SetMilestones = ({ contract, onChangeContract }: props) => {
  return (
    <div className='flex h-full w-full flex-col items-start justify-between rounded-lg px-4 pt-4 shadow-[2px_2px_20px_0px_rgba(0,0,0,0.84)]'>
      <div className='flex w-full flex-col justify-start'>
        <div className='self-strech flex flex-col gap-0.5 mb-4'>
          <div className='self-strech flex items-center gap-1'>
            <div className='text-[20px] font-semibold leading-tight'>
              Create contract
            </div>
          </div>
          <div className='self-strech flex justify-start text-sm font-medium leading-snug text-[#595B5A]'>
            Select project milestones
          </div>
        </div>
        <div className='self-strech flex w-full flex-col items-start gap-6'>
          <div className='flex w-full flex-col gap-4 rounded-lg border-[1px] border-[#D7D7D7] bg-[#F2F2F2] p-4'>
            <div className='flex w-full flex-col items-start gap-1.5'>
              <div className='text-sm font-normal leading-5'>Milestone 1</div>
              <input
                className='w-full rounded-lg border-[#D7D7D7] px-4 py-2.5 text-base font-normal leading-6'
                placeholder='Enter name'
              />
            </div>
            <div className='flex w-full flex-col items-start gap-1.5'>
              <div className='text-sm font-normal leading-5'>Amount</div>
              <input
                className='w-full rounded-lg border-[#D7D7D7] px-4 py-2.5 text-base font-normal leading-6'
                placeholder='0.0'
              />
            </div>
          </div>

          <div className='flex w-full flex-col gap-4 rounded-lg border-[1px] border-[#D7D7D7] bg-[#F2F2F2] p-4'>
            <div className='flex w-full flex-col items-start gap-1.5'>
              <div className='text-sm font-normal leading-5'>Milestone 2</div>
              <input
                className='w-full rounded-lg border-[#D7D7D7] px-4 py-2.5 text-base font-normal leading-6'
                placeholder='Enter name'
              />
            </div>
            <div className='flex w-full flex-col items-start gap-2'>
              <div className='flex w-full flex-col items-start gap-1.5 '>
                <div className='text-sm font-normal leading-5'>Amount</div>
                <input
                  className='w-full rounded-lg border-[#D7D7D7] px-4 py-2.5 text-base font-normal leading-6'
                  placeholder='0.0'
                />
              </div>
              <div className='flex w-full justify-end p-2'>
                <img
                  src='/svg/trash.svg'
                  alt='trash'
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-end mt-2'>
          <div className='text-[#6230EC] flex gap-2 px-3 py-1.5 font-semibold text-base'>
            Add milestones
            <img src='/svg/plus.svg' alt='plus' width={24} height={24} />
          </div>
        </div>
      </div>
      <div className='w-full py-4'>
        <button
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white'
          onClick={onChangeContract}
        >
          Create Continue
        </button>
      </div>
    </div>
  );
};

export default SetMilestones;
