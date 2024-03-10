/* eslint-disable jsx-a11y/alt-text */

/* eslint-disable @next/next/no-img-element */
import { useWalletSelector } from '@/components/common/near-wallet/walletSelectorContext';
import { CONTRACT } from '@/constant/constant';
import { defaultMileStone, MileStoneType } from '@/types';
import { neartoyocto, yoctotonear } from '@/utils/display';
import { callMethod, callMethodBatch, viewMethod } from '@/utils/wallet';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface props {
  onChangeContract: any;
  myContract: any;
}

const SetMilestonesWithUser = ({ myContract, onChangeContract }: props) => {
  const { selector, accountId } = useWalletSelector();

  const [mileStones, setMilestones] = useState<any>([]);

  const [schedules, setSchedules] = useState<MileStoneType[]>([
    defaultMileStone,
  ]);

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
      } catch (error) {
        console.log(error);
      }
    };
    getMethod();
  }, [myContract, callMethod]);

  const onChange = (e: any, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSchedules((prev) => [
      ...prev.slice(0, index),
      {
        ...prev[index],
        [e.target.name]: e.target.value,
      },
      ...prev.slice(index + 1),
    ]);
  };

  const addSchedule = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setSchedules([...schedules, defaultMileStone]);
  };

  const deleteSchedule = async () => {
    setSchedules((prev) => prev.slice(0, prev.length - 1));
  };

  const submitSchedules = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    for (let i = 0; i < schedules.length; i++) {
      if (schedules[i].amount <= 0 || schedules[i].name == '') {
        toast.warning('Input Corret Value', { autoClose: 10000 });
        return;
      }
    }
    if (accountId) {
      const arrayArgs = [];
      for (let i = 0; i < schedules.length; i++) {
        arrayArgs.push({
          project_id: myContract?.projectId,
          short_code: schedules[i]?.name,
          description: myContract?.jobDescription,
          value: neartoyocto(schedules[i]?.amount),
        });
      }
      const res = await callMethodBatch({
        selector: selector,
        accountId: accountId,
        contractId: CONTRACT,
        method: 'add_schedule',
        gas: '30000000000000',
        args: arrayArgs,
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

  let isApproved = true;
  for (let i = 0; i < mileStones.length; i++) {
    if (mileStones[i][1].schedule_state != 'Approved') {
      isApproved = false;
      break;
    }
  }

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
          {mileStones.length != 0 ? (
            <div className='self-strech flex flex-col py-4'>
              {mileStones &&
                mileStones.map((milestone: any, index: number) => (
                  <div key={index}>
                    <div className='flex justify-between gap-4 p-2'>
                      <div className='flex gap-2'>
                        {['Funded', 'Planned'].includes(
                          milestone[1]?.schedule_state
                        ) && (
                          <div className='h-5 w-5 rounded-full bg-[#D7D7D7]'></div>
                        )}
                        {milestone[1]?.schedule_state == 'Started' && (
                          <img src='/svg/approve.svg' width={20} height={20} />
                        )}
                        {milestone[1]?.schedule_state == 'Approved' && (
                          <div className='bg-primary-default h-5 w-5 items-center justify-center rounded-full p-1'>
                            <img src='/svg/check.svg' width={16} height={16} />
                          </div>
                        )}
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
          ) : (
            <>
              <div className='self-strech flex h-full w-full flex-col items-start gap-6'>
                {schedules &&
                  schedules.map((schedule, index) => (
                    <>
                      <div className='flex w-full flex-col gap-4 rounded-lg border-[1px] border-[#D7D7D7] bg-[#F2F2F2] p-4'>
                        <div className='flex w-full flex-col items-start gap-1.5'>
                          <div className='text-sm font-normal leading-5'>
                            {`Milestone ${index + 1}`}
                          </div>
                          <input
                            className='w-full rounded-lg border-[#D7D7D7] px-4 py-2.5 text-base font-normal leading-6'
                            placeholder='Enter name'
                            name='name'
                            value={schedule.name}
                            onChange={(e) => onChange(e, index)}
                          />
                        </div>
                        <div className='flex w-full flex-col items-start gap-1.5'>
                          <div className='text-sm font-normal leading-5'>
                            Amount
                          </div>
                          <input
                            className='w-full rounded-lg border-[#D7D7D7] px-4 py-2.5 text-base font-normal leading-6'
                            placeholder='0.0'
                            name='amount'
                            type='number'
                            min='0'
                            value={schedule.amount}
                            onChange={(e) => onChange(e, index)}
                          />
                          <div
                            className={`flex w-full justify-end p-2 ${
                              (schedules.length - 1 != index || index == 0) &&
                              'hidden'
                            }`}
                            onClick={deleteSchedule}
                          >
                            <img src='/svg/trash.svg' width={24} height={24} />
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
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
            </>
          )}
        </div>
      </div>
      <div className='bottom-0 flex w-full py-4'>
        {mileStones.length != 0 ? (
          <button
            className='flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white'
            disabled={true}
          >
            {isApproved ? 'Complete Approved' : 'In progress'}
          </button>
        ) : (
          <button
            className='flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white'
            onClick={submitSchedules}
          >
            Submit Contract
          </button>
        )}
      </div>
    </>
  );
};

export default SetMilestonesWithUser;
