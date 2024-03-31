'use client';

import { DataTable } from '@/app/wallet/data-table';
import { Sidebar } from '@/components';
import { Header } from '@/components/header';
import { Profile } from '@/components/profile';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/redux/hook';
import { MoveLeft, MoveRight, Plus, Send } from 'lucide-react';
import Image from 'next/image';

const Home = () => {
  const { user } = useAuth();
  const { toggleOpenSidebar } = useAppSelector((state) => state.userReducer);

  return (
    <>
      <Header />
      {user && <Sidebar show={toggleOpenSidebar} userInfo={user} />}
      <div className='container my-24'>
        <div className='rounded-xl bg-white border border-2 border-gray-200'>
          <div className='flex flex-col lg:flex-row lg:justify-between gap-3 items-center justify-center lg:px-16 rounded-tl-xl rounded-tr-xl bg-[#0D0449] min-h-40 text-white'>
            <div className='flex flex-row gap-2 items-center justify-center'>
              <div>
                <Image
                  src='/svg/usdc-wallet.svg'
                  alt='USDC'
                  width={40}
                  height={40}
                />
              </div>
              <div className='flex flex-col'>
                <div className='text-md font-thin'>Balance</div>
                <div className='font-semibold text-xl'>0 USDC</div>
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <Button className='bg-sorbet gap-2'>
                Send
                <Send size={18} />
              </Button>
              <Button className='bg-sorbet gap-2 hover:bg-gray-100'>
                Top Up
                <Plus size={19} />
              </Button>
            </div>
          </div>
          <div className='border-b-1 border-b border-gray-200 p-10 text-2xl'>
            Transaction History
          </div>
          <div className='border-b-1 border-b border-gray-200 min-h-[50vh]'>
            <DataTable
              currentPage={1}
              totalPages={10}
              onPageChange={(page) => console.log(page)}
              transactions={[
                {
                  id: '1',
                  timestamp: '24/02/2024',
                  symbol: 'USDC',
                  txnId: 'random',
                  amount: '2,564.3',
                },
              ]}
            />
          </div>
          {/* <div className='p-8 flex flex-col gap-3'>
            <div className='block lg:hidden flex flex-row gap-1 justify-center align-center'>
              <Button variant='ghost' size='icon'>
                1
              </Button>
              <Button variant='ghost' size='icon'>
                2
              </Button>
              <Button variant='ghost' size='icon'>
                3
              </Button>
              <Button variant='ghost' size='icon'>
                ...
              </Button>
              <Button variant='ghost' size='icon'>
                8
              </Button>
              <Button variant='ghost' size='icon'>
                9
              </Button>
              <Button variant='ghost' size='icon'>
                10
              </Button>
            </div>
            <div className='flex gap-2 lg:gap-1 flex-row justify-center lg:justify-between'>
              <Button variant='outline' className='gap-2 min-w-32'>
                <MoveLeft />
                <span>Previous</span>
              </Button>

              <div className='hidden lg:block flex flex-row gap-1 justify-center align-center'>
                <Button variant='ghost' size='icon'>
                  1
                </Button>
                <Button variant='ghost' size='icon'>
                  2
                </Button>
                <Button variant='ghost' size='icon'>
                  3
                </Button>
                <Button variant='ghost' size='icon'>
                  ...
                </Button>
                <Button variant='ghost' size='icon'>
                  8
                </Button>
                <Button variant='ghost' size='icon'>
                  9
                </Button>
                <Button variant='ghost' size='icon'>
                  10
                </Button>
              </div>

              <Button variant='outline' className='gap-2 min-w-32'>
                <span>Next</span>
                <MoveRight />
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Home;
