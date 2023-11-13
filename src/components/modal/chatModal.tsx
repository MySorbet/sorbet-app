import Image from 'next/image';
import {useState, useEffect} from 'react';

import Milestones from '@/components/contract/milestones';
import SelectType from '@/components/contract/selectType';
import SetMilestones from '@/components/contract/setMilestones';
import CompleteContract from '@/components/contract/completeContract';

interface Props {
  showChatModal: boolean;
  toggleChatModal: any;
}

const ChatModal = ({ showChatModal, toggleChatModal }: Props) => {

  const [contract, setContract] = useState(0);

  const changeContract = () => {
    if(contract == 3) {
      toggleChatModal();
      setContract(0);
    } else {
      setContract(contract + 1);
    }
  };

  return (
    <>
      <div
        className={`z-20 inline-flex min-h-[800px] w-2/3 gap-4 overflow-y-auto rounded-[20px] bg-[#F7F7F7] p-6 pt-4 text-black max-sm:h-5/6 max-sm:w-[300px] ${
          showChatModal ? 'fixed' : 'hidden'
        }`}
      >
        <div className='self-strech flex w-7/12 flex-col items-start gap-4'>
          <div className='flex items-center gap-2'>
            <div className='text-xl font-semibold leading-tight'>
              Branding redesign
            </div>
            <div className='flex w-fit items-center justify-center rounded-full bg-yellow-400 px-3 py-1.5 text-[10px] font-semibold leading-tight text-yellow-800'>
              Pending
            </div>
          </div>
          <div className='relative flex h-full w-full flex-col gap-6 rounded-lg bg-yellow-100 py-3 pl-3 pr-4'>
            <div className='self-strech flex items-start gap-2.5'>
              <img src='/avatar.svg' alt='avatar' width={32} height={32} />
              <div className='flex flex-col items-start gap-2 pt-1'>
                <div className='flex items-center gap-2 leading-3'>
                  <div className='text-xs font-semibold'>First Name</div>
                  <div className='text-xs font-normal text-[#666]'>9:55AM</div>
                </div>
                <div className='items-start gap-2.5 rounded-lg bg-[#D7D7D7] px-3 py-2 leading-6'>
                  Hello!
                </div>
                <div className='items-start gap-2.5 rounded-lg bg-[#D7D7D7] px-3 py-2 leading-6'>
                  Hello!
                </div>
                <div className='items-start gap-2.5 rounded-lg bg-[#D7D7D7] px-3 py-2 leading-6'>
                  Hello!
                </div>
              </div>
            </div>
            <div className='self-strech flex items-start gap-2.5'>
              <img src='/avatar.svg' alt='avatar' width={32} height={32} />
              <div className='flex flex-col items-start gap-2 pt-1'>
                <div className='flex items-center gap-2 leading-3'>
                  <div className='text-xs font-semibold'>First Name</div>
                  <div className='text-xs font-normal text-[#666]'>9:55AM</div>
                </div>
                <div className='items-start gap-2.5 rounded-lg bg-primary-default text-white px-3 py-2 leading-6'>
                  Hello!
                </div>
                <p className='gap-2.5 rounded-lg bg-primary-default text-white px-3 py-2 leading-6'>
                  Hello! My name is Chris Kally.
                  I am web full stack develoepr.
                  I want to work with you.
                  I am looking hearing from you.
                </p>
                <div className='items-start gap-2.5 rounded-lg bg-primary-default text-white px-3 py-2 leading-6'>
                  Hello!
                </div>
              </div>
            </div>
            <div className='absolute w-[calc(100%-24px)] bottom-3 pt-4 pb-2 px-5 gap-6 items-center rounded-lg justify-end self-strech bg-white'>
              <input placeholder='Type your message' className='w-full border-none'/>
              <div className='flex h-8 pl-4 pr-2 justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <img src='/svg/chat/pluscircle.svg' alt='pluscircle' className='cursor-pointer' width={20} height={20} />
                    <img src='/svg/chat/record.svg' alt='record' className='cursor-pointer' width={20} height={20} />
                    <img src='/svg/chat/emoji.svg' alt='emoji' className='cursor-pointer' width={20} height={20} />
                  </div>
                  <div className='w-4 h-[1px] bg-[#F2F2F2] rotate-90'></div>
                  <div className='flex items-center gap-2'>
                    <img src='/svg/chat/link.svg' className='cursor-pointer' alt='link' width={20} height={20} />
                    <img src='/svg/chat/textBold.svg' className='cursor-pointer' alt='textBold' width={20} height={20} />
                    <img src='/svg/chat/textItalic.svg' className='cursor-pointer' alt='textItalic' width={20} height={20} />
                    <img src='/svg/chat/listBullets.svg' className='cursor-pointer' alt='listBullets' width={20} height={20} />
                    <img src='/svg/chat/listNumbers.svg' className='cursor-pointer' alt='listNumbers' width={20} height={20} />
                  </div>
                </div>
                <div className='flex p-2 items-start cursor-pointer gap-[10px] bg-dark opacity-20 rounded-xl'>
                  <img src='/svg/Arrow.svg' alt='Arrow' width={16} height={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='self-strech flex w-5/12 flex-col items-start gap-2'>
          <div className='flex w-full cursor-pointer justify-end'>
            <img
              src='/images/cancel.png'
              alt='close'
              width={40}
              height={40}
              onClick={toggleChatModal}
            />
          </div>
          {contract == 0 && <Milestones contract={contract} onChangeContract={changeContract}/> }
          {contract == 1 && <SelectType contract={contract} onChangeContract={changeContract}/> }
          {contract == 2 && <SetMilestones contract={contract} onChangeContract={changeContract}/> }
          {contract == 3 && <CompleteContract contract={contract} onChangeContract={changeContract}/> }
        </div>
      </div>
    </>
  );
};

export default ChatModal;
