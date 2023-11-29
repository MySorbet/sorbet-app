/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';

import { useWalletSelector } from '@/components/commons/near-wallet/walletSelectorContext';

import { CONTRACT } from '@/constant/constant';
import { yoctotonear } from '@/utils/display';
import { callMethod, viewMethod } from '@/utils/wallet';

interface props {
  onChangeContract: any;
  myContract: any;
}

const SetMilestonesWithClient = ({ myContract, onChangeContract }: props) => {
  const { selector, accountId } = useWalletSelector();
  const [mileStones, setMilestones] = useState<any[]>([]);

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

  const fundSchedule = async (milestone: any) => {
    const id = parseInt(milestone?.[0].split('||')[1]);
    const scheduleAmount = (
      (parseInt(milestone[1].value) / 1e21) *
      1.021
    ).toFixed(0);
    const realAmount = `${scheduleAmount}000000000000000000000`;

    if (accountId) {
      const res = await callMethod({
        selector: selector,
        contractId: CONTRACT,
        accountId: accountId,
        method: 'fund_schedule',
        gas: '30000000000000',
        deposit: realAmount,
        args: {
          project_id: myContract?.projectId,
          schedule_id: `${id}`,
        },
      });
    }
  };

  const approveSchedule = async (milestone: any) => {
    if (accountId) {
      try {
        const id = parseInt(milestone[0].split('||')[1]);
        const res = await callMethod({
          selector: selector,
          accountId: accountId,
          contractId: CONTRACT,
          method: 'approve_schedule',
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
              Contract created! Review the milestones before accepting the
              contract
            </div>
          </div>
          <div className='self-strech flex flex-col py-4'>
            {mileStones &&
              mileStones.map((milestone, index) => (
                <div key={index}>
                  <div className='flex justify-between gap-4 p-2'>
                    <div className='flex items-center gap-2'>
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
                      {milestone[1]?.schedule_state == 'Planned' && (
                        <div
                          className='flex cursor-pointer text-[#6230FC]'
                          onClick={() => fundSchedule(milestone)}
                        >
                          Fund
                        </div>
                      )}
                      {milestone[1]?.schedule_state == 'Started' && (
                        <div
                          className='flex cursor-pointer text-[#6230FC]'
                          onClick={() => approveSchedule(milestone)}
                        >
                          Approve
                        </div>
                      )}
                      {['Funded', 'Approved'].includes(
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
      {mileStones && (
        <div className='bottom-0 flex w-full py-4'>
          <button className='flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white'>
            {isApproved ? 'Complete Approved' : 'In progress'}
          </button>
        </div>
      )}
    </>
  );
};

export default SetMilestonesWithClient;
