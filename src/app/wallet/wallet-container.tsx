import { getTransactions } from '@/api/user';
import { DataTable } from '@/app/wallet/data-table';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { Plus, Send } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';

export const WalletContainer = () => {
  const { user } = useAuth();
  const [transactionsData, setTransactionsData] = useState({
    transactions: [],
    currentPage: 1,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchTransactions = useCallback(
    async (pageNumber = transactionsData.currentPage, itemsPerPage = 20) => {
      if (user) {
        setIsLoading(true);
        try {
          const response = await getTransactions(
            user?.id,
            pageNumber,
            itemsPerPage
          );
          if (response.status === 'success' && response.data) {
            if (response.data.data.length > 0) {
              setTransactionsData({
                transactions: response.data.data,
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
              });
            } else {
              setTransactionsData((prevState) => ({
                ...prevState,
                transactions: [],
              }));
            }
          } else {
            setErrorMessage('The request failed, please try again.');
            setTransactionsData((prevState) => ({
              ...prevState,
              transactions: [],
            }));
          }
        } catch (error) {
          console.error(error);
          setErrorMessage('The request failed, please try again.');
          setTransactionsData((prevState) => ({
            ...prevState,
            transactions: [],
          }));
        } finally {
          setIsLoading(false);
        }
      }
    },
    [user, transactionsData.currentPage]
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePageChange = (newPage: number) => {
    fetchTransactions(newPage);
  };

  return (
    <div className='shadow-sm rounded-xl bg-white border border-2 border-gray-200'>
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
          <Button className='bg-sorbet gap-2 hover:bg-sorbet hover:brightness-125'>
            Send
            <Send size={18} />
          </Button>
          <Button className='bg-sorbet gap-2 hover:bg-sorbet hover:brightness-125'>
            Top Up
            <Plus size={19} />
          </Button>
        </div>
      </div>
      <div className='border-b-1 border-b border-gray-200 p-10 text-2xl'>
        Transaction History
      </div>
      <div className='border-b-1 border-b border-gray-200 min-h-[50vh]'>
        {errorMessage && (
          <p className='text-red-500 text-center py-5'>{errorMessage}</p>
        )}
        <DataTable
          currentPage={transactionsData.currentPage}
          totalPages={transactionsData.totalPages}
          onPageChange={handlePageChange}
          tableHeaders={['Date', 'Cryptocurrency', 'Transaction ID', 'Amount']}
          transactions={transactionsData.transactions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
