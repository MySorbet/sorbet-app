/* eslint-disable @next/next/no-img-element */

interface props {
  contract: number;
  onChangeContract: any;
}

const SelectType = ({ onChangeContract }: props) => {
  return (
    <div className='flex h-full w-full flex-col items-start justify-between gap-4 px-4 pt-4'>
      <div className='flex w-full flex-col justify-start gap-4'>
        <div className='self-strech flex flex-col gap-0.5'>
          <div className='self-strech flex items-center gap-1'>
            <div className='text-[20px] font-semibold leading-tight'>
              Create contract
            </div>
          </div>
          <div className='self-strech flex justify-start text-sm font-medium leading-snug text-[#595B5A]'>
            Select payment type
          </div>
        </div>
        <div className='self-strech flex w-full flex-col items-start gap-6 py-4'>
          <div className='flex w-full flex-col gap-4 rounded-lg border-[1px] border-[#D7D7D7] bg-white p-4'>
            <div className='self-strech  flex w-full items-center justify-between'>
              <img
                src='/svg/chat/bank-note-02.svg'
                alt='bank-note'
                width={40}
                height={40}
              />
              <div className='h-5 w-5 rounded-full bg-[#D7D7D7]'></div>
            </div>
            <div className='self-strech flex flex-col items-start gap-1'>
              <div className='text-base font-semibold leading-6'>
                Fixed Price
              </div>
              <div className='text-xs font-normal leading-[18px]'>
                A one-time fixed price payment once the project is completed
              </div>
            </div>
          </div>
          <div className='flex w-full flex-col gap-4 rounded-lg border-[1px] border-[#D7D7D7] bg-white p-4'>
            <div className='self-strech  flex w-full items-center justify-between'>
              <img
                src='/svg/chat/coins-01.svg'
                alt='coins'
                width={40}
                height={40}
              />
              <div className='h-5 w-5 rounded-full bg-[#D7D7D7]'></div>
            </div>
            <div className='self-strech flex flex-col items-start gap-1'>
              <div className='text-base font-semibold leading-6'>
                Milestones
              </div>
              <div className='text-xs font-normal leading-[18px]'>
                Set milestones and receive payment once completed
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full py-4'>
        <button
          className='flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white'
          onClick={onChangeContract}
        >
          Continue
          <img
            src='/images/arrow-narrow-right.svg'
            alt='arrow'
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
};

export default SelectType;
