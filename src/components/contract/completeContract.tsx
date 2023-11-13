import Image from 'next/image';

interface props {
  contract: number;
  onChangeContract: any;
}

const CompleteContract = ({ onChangeContract }: props) => {
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
          <div className='self-strech flex items-start justify-start text-sm font-medium leading-snug text-[#595B5A]'>
            Contract created! Get started once the client signs the contract.
          </div>
        </div>
        <div className='self-strech flex flex-col gap-0.5 py-4'>
          <div className='flex gap-4 p-2 items-center justify-center'>
            <div className='h-5 w-5 p-[3px] rounded-full flex items-center justify-center bg-[#6230EC]'>
              <img
                src='/svg/check.svg'
                alt='check'
                width={14}
                height={14}
              />
            </div>
            <div className='flex w-full justify-between items-center text-xs font-normal leading-5 text-[#101010]'>
              <p>Style guide design</p>
              <div className='text-[#6230EC]'>$500</div>
            </div>
          </div>
          <div className='flex pl-4'>
            <div className='h-4 w-0.5 bg-[#D9D9D9]'></div>
          </div>
          <div className='flex gap-4 p-2 items-center justify-center'>
            <div className='h-5 w-5 p-[3px] rounded-full flex items-center justify-center bg-[#6230EC]'>
              <img
                src='/svg/check.svg'
                alt='check'
                width={14}
                height={14}
              />
            </div>
            <div className='flex w-full justify-between items-center text-xs font-normal leading-5 text-[#101010]'>
              <p>Brand book design</p>
              <div className='text-[#6230EC]'>$500</div>
            </div>
          </div>
          <div className='flex pl-4'>
            <div className='h-4 w-0.5 bg-[#D9D9D9]'></div>
          </div>
          <div className='flex gap-4 p-2 items-center justify-center'>
            <div className='h-5 w-5 p-[3px] rounded-full flex items-center justify-center bg-[#6230EC]'>
              <img
                src='/svg/check.svg'
                alt='check'
                width={14}
                height={14}
              />
            </div>
            <div className='flex w-full justify-between items-center text-xs font-normal leading-5 text-[#101010]'>
              <p>Landing page design</p>
              <div className='text-[#6230EC]'>$1000</div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full py-4'>
        <button
          className='w-full items-center justify-end rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white'
          onClick={onChangeContract}
        >
          Complete
        </button>
      </div>
    </div>
  );
};

export default CompleteContract;
