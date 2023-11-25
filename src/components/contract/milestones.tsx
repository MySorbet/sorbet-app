import { useEffect } from 'react';

import { useWalletSelector } from '@/components/commons/near-wallet/walletSelectorContext';

import { CONTRACT } from '@/constant/constant';
import { useAppSelector } from '@/redux/hook';
import { callMethod, viewMethod } from '@/utils/wallet';

/* eslint-disable @next/next/no-img-element */
interface props {
  onChangeStatus: any;
}

const Milestones = ({ onChangeStatus }: props) => {
  const { selector, accountId } = useWalletSelector();
  const role = useAppSelector((state) => state.userReducer.role);
  const currentUser = useAppSelector((state) => state.userReducer.user);

  const currentContractId = useAppSelector(
    (state) => state.contractReducer.currentContractId
  );
  const myContracts = useAppSelector(
    (state) => state.contractReducer.contracts
  );
  const myContract = myContracts?.find(
    (contract) => contract.id == currentContractId
  );
  const mywallet = myContract?.freelancer?.nearWallet;
  const otherwallet = myContract?.client?.nearWallet;

  useEffect(() => {
    if (mywallet && otherwallet && myContract) {
      try {
        const getProject = async () => {
          const res = await viewMethod({
            selector: selector,
            contractId: CONTRACT,
            method: 'get_project',
            args: { project_id: myContract?.projectId },
          });
          if (res) {
            console.log(res, 'ddd');
            onChangeStatus(1);
          } else {
            onChangeStatus(0);
          }
        };
        getProject();
      } catch (err) {
        console.log(err);
      }
    }
  }, [mywallet, otherwallet, myContract]);

  const onEnterContract = async () => {
    if (mywallet && otherwallet && accountId) {
      try {
        const res = await callMethod({
          selector: selector,
          accountId: accountId,
          contractId: CONTRACT,
          method: 'create_project',
          gas: '30000000000000',
          args: {
            project_id: myContract?.projectId,
            client_id: otherwallet,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className='relative flex h-full w-full flex-col items-start gap-4 overflow-auto px-4 pt-4'>
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
      <div className='absolute bottom-0 left-0 w-full py-4'>
        {role == 'client' ? (
          <button className='h-11 w-full items-center justify-end rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white'>
            Approve contract
          </button>
        ) : (
          <button
            className='h-11 w-full items-center justify-end rounded-lg bg-[#6230FC] px-4 py-[10px] text-sm font-semibold leading-5 text-white'
            onClick={onEnterContract}
          >
            Create contract
          </button>
        )}
      </div>
    </div>
  );
};

export default Milestones;
