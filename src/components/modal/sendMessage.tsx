/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { initContract } from '@/api/contract';
import { useAppSelector } from '@/redux/hook';

import { ContractType, defaultContract } from '@/types';

interface Props {
  editModal: boolean;
  popModal: any;
  freelancerId: string;
}

const SendMessage = ({ editModal, popModal, freelancerId }: Props) => {

  const router = useRouter();
  const client = useAppSelector((state) => state.userReducer.user);
  const [content, setContent] = useState(defaultContract);

  const onChange = (e: any) => {  
      setContent({
        ...content,
        [e.target.name]: e.target.value,
      });
  };

  const onClose = () => {
    setContent(defaultContract);
    popModal();
  };

  const sent = async () => {
    const data: ContractType = {
      id: content.id,
      jobTitle: content.jobTitle,
      jobDescription: content.jobDescription,
      startTime: content.startTime,
      budget: content.budget,
      clientId: client.id,
      freelancerId: freelancerId
    }
    
    const res = await initContract(data);
    if(res.status == 'success') {
      router.push('/gigs');
    }
  }

  return (
    <>
      <div
        className={`z-50 w-[500px] items-center justify-center overflow-y-auto rounded-2xl bg-white p-6 pt-4 text-black max-sm:h-5/6 max-sm:w-[300px] ${
          editModal ? 'fixed' : 'hidden'
        }`}
      >
        <div className='mb-3 flex cursor-pointer justify-end' onClick={onClose}>
          <img src='/images/cancel.png' alt='cancel' width={40} height={40} />
        </div>
        <div className='flex flex-col items-start gap-6 px-6 pb-6'>
          <h1 className='text-[32px]'>Message to freelancer</h1>
          <div className='flex w-full flex-col items-start gap-[6px]'>
            <label className='text-[#595B5A]'>Name task or project</label>
            <input
              className='w-full rounded-lg'
              placeholder='Project Name'
              name='jobTitle'
              defaultValue={content?.jobTitle}
              onChange={onChange}
            />
          </div>
          <div className='flex w-full flex-col items-start gap-[6px]'>
            <label className='text-[#595B5A]'>Describe your project or tasks</label>
            <textarea
              className='w-full rounded-lg'
              placeholder='Write here'
              name='jobDescription'
              rows={4}
              defaultValue={content?.jobDescription}
              onChange={onChange}
            />
          </div>
          <div className='flex w-full flex-col items-start gap-[6px]'>
            <label className='text-[#595B5A]'>When are you looking to start</label>
            <select
              className='w-full rounded-lg'
              name='startTime'
              defaultValue={content?.startTime}
              onChange={onChange}
            >
              <option value='With in the next week'>With in the next week</option>
              <option value='With in the one month'>With in the one month</option>
              <option value='With in three months'>With in three months</option>
              <option value='More than six months'>More than six months</option>
            </select>
          </div>
          <div className='flex w-full flex-col items-start gap-[6px]'>
            <label className='text-[#595B5A]'>Do you have a budget in mind</label>
            <select
              className='w-full rounded-lg '
              name='budget'
              defaultValue={content?.budget}
              onChange={onChange}
            >
              <option value='$500-$1000'>$500-$1000</option>
              <option value='$100o-$2000'>$100o-$2000</option>
              <option value='$2000-$5000'>$2000-$5000</option>
              <option value='$5000-$20000'>$5000-$20000</option>
            </select>
          </div>
          <div className='item w-full'>
            <button
              className='bg-primary-default h-11 gap-1 self-stretch rounded-lg px-2 py-1 text-sm text-white'
              onClick={sent}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendMessage;
