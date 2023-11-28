/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { useWalletSelector } from '@/components/commons/near-wallet/walletSelectorContext1';

import { CONTRACT } from '@/constant/constant';
import { neartoyocto, yoctotonear } from '@/utils/display';
import { callMethod, viewMethod } from '@/utils/wallet';

import { defaultMileStone, MileStoneType } from '@/types';
interface props {
  onChangeContract: any;
  myContract: any;
}

const SetMilestonesWithUser = ({ myContract, onChangeContract }: props) => {
  const { selector, accountId } = useWalletSelector();
  const [mileStone, setMilestone] = useState<MileStoneType>(defaultMileStone);

  const [mileStones, setMilestones] = useState<any>([]);

  useEffect(() => {
    const getMethod = async () => {
      try {
        const res = await viewMethod({
          selector: selector,
          contractId: CONTRACT,
          method: 'get_schedules_by_projectid',
          args: {
            project_id: myContract?.projectId,
          },
        });
        setMilestones(res);
        console.log(res, 'schedules');
      } catch (error) {
        console.log(error);
      }
    };
    getMethod();
  }, [myContract, callMethod]);

  const onChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setMilestone({
      ...mileStone,
      [e.target.name]: e.target.value,
    });
  };

  const addSchedule = async () => {
    if (mileStone.amount <= 0 || mileStone.name == '') {
      toast.warning('Input Corret Value', { autoClose: 10000 });
      return;
    }
    if (accountId) {
      const res = await callMethod({
        selector: selector,
        accountId: accountId,
        contractId: CONTRACT,
        method: 'add_schedule',
        gas: '30000000000000',
        args: {
          project_id: myContract?.projectId,
          short_code: mileStone?.name,
          description: myContract?.jobDescription,
          value: neartoyocto(mileStone?.amount),
        },
      });
    }
  };

  const startSchedule = async (milestone: any) => {
    if (accountId) {
      try {
        const id = parseInt(milestone[0].split('||')[1]);
        await callMethod({
          selector: selector,
          accountId: accountId,
          contractId: CONTRACT,
          method: 'start_schedule',
          gas: '30000000000000',
          args: {
            project_id: myContract?.projectId,
            schedule_id: `${id}`,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className='relative flex h-full w-full flex-col items-start overflow-y-auto rounded-lg px-4 pt-4'>
        <div className='flex w-full flex-col justify-start'>
          <div className='self-strech mb-4 flex flex-col gap-0.5'>
            <div className='self-strech flex items-center gap-1'>
              <div className='text-[20px] font-semibold leading-tight'>
                Create contract
              </div>
            </div>
            <div className='self-strech flex justify-start text-sm font-medium leading-snug text-[#595B5A]'>
              Select project milestones
            </div>
          </div>
          <div className='self-strech flex h-full w-full flex-col items-start gap-6'>
            <div className='flex w-full flex-col gap-4 rounded-lg border-[1px] border-[#D7D7D7] bg-[#F2F2F2] p-4'>
              <div className='flex w-full flex-col items-start gap-1.5'>
                <div className='text-sm font-normal leading-5'>Milestone</div>
                <input
                  className='w-full rounded-lg border-[#D7D7D7] px-4 py-2.5 text-base font-normal leading-6'
                  placeholder='Enter name'
                  name='name'
                  value={mileStone.name}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className='flex w-full flex-col items-start gap-1.5'>
                <div className='text-sm font-normal leading-5'>Amount</div>
                <input
                  className='w-full rounded-lg border-[#D7D7D7] px-4 py-2.5 text-base font-normal leading-6'
                  placeholder='0.0'
                  name='amount'
                  type='number'
                  min='0'
                  value={mileStone.amount}
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
          </div>
          <div className='mt-2 flex w-full justify-end'>
            <div
              className='flex cursor-pointer gap-2 px-3 py-1.5 text-base font-semibold text-[#6230EC]'
              onClick={addSchedule}
            >
              Add milestones
              <img src='/svg/plus.svg' alt='plus' width={24} height={24} />
            </div>
          </div>
          <div className='self-strech flex flex-col py-4'>
            {mileStones &&
              mileStones.map((milestone: any, index: number) => (
                <div key={index}>
                  <div className='flex justify-between gap-4 p-2'>
                    <div className='flex gap-2'>
                      <div className='h-5 w-5 rounded-full bg-[#D7D7D7]'></div>
                      <div className='text-xs font-normal leading-5 text-[#595B5A]'>
                        {milestone[1]?.shortcode}
                      </div>
                    </div>
                    <div className='flex gap-4'>
                      <div className='flex'>
                        {yoctotonear(milestone[1]?.value)}$
                      </div>
                      {milestone[1]?.schedule_state == 'Funded' && (
                        <div
                          className='flex cursor-pointer text-[#6230FC]'
                          onClick={() => startSchedule(milestone)}
                        >
                          Start
                        </div>
                      )}
                      {['Planned', 'Started', 'Approved'].includes(
                        milestone[1]?.schedule_state
                      ) && (
                        <div className='text-red flex cursor-pointer'>
                          {milestone[1]?.schedule_state}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`flex pl-4 ${
                      index == mileStones.length - 1 && 'hidden'
                    }`}
                  >
                    <div className='h-4 w-0.5 bg-[#D9D9D9]'></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* <div className='bottom-0 flex w-full py-4'>
        <button
          className='flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white'
          onClick={addSchedules}
        >
          Submit Contract
        </button>
      </div> */}
    </>
  );
};

export default SetMilestonesWithUser;
