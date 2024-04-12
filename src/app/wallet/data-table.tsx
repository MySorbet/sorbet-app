import { Spinner } from '@/components/common';
import { Button } from '@/components/ui/button';
import { MoveLeft, MoveRight, SquareArrowOutUpRight } from 'lucide-react';
import React from 'react';

interface Transaction {
  id: string;
  createdAt: string;
  asset: string;
  txnId: string;
  amount: string;
}

interface DataTableProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  tableHeaders: string[]; // Add tableHeaders to props
}

const PageNumbers: React.FC<{
  totalPages: number;
  onPageChange: (page: number) => void;
  currentPage: number;
}> = ({ totalPages, onPageChange, currentPage }) => {
  if (totalPages <= 5) {
    return (
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant='ghost'
            size='icon'
            onClick={() => onPageChange(i + 1)}
            className={currentPage === i + 1 ? 'text-blue-500' : ''}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    );
  } else {
    return (
      <div>
        {Array.from({ length: 3 }, (_, i) => (
          <Button
            key={i}
            variant='ghost'
            size='icon'
            onClick={() => onPageChange(i + 1)}
            className={currentPage === i + 1 ? 'text-blue-500' : ''}
          >
            {i + 1}
          </Button>
        ))}
        <span>...</span>
        {Array.from({ length: 3 }, (_, i) => (
          <Button
            key={i}
            variant='ghost'
            size='icon'
            onClick={() => onPageChange(totalPages - 2 + i)}
            className={
              currentPage === totalPages - 2 + i ? 'text-blue-500' : ''
            }
          >
            {totalPages - 2 + i}
          </Button>
        ))}
      </div>
    );
  }
};

export const DataTable: React.FC<DataTableProps> = ({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
  isLoading, // Destructure isLoading prop
  tableHeaders, // Destructure tableHeaders prop
}) => {
  return (
    <div className='relative min-h-[50vh]'>
      {isLoading && (
        <div className='absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10 min-h-full'>
          <Spinner />
        </div>
      )}
      <div
        className={`overflow-x-auto relative sm:rounded-lg min-h-full ${
          isLoading ? 'opacity-50' : ''
        }`}
      >
        {transactions.length < 1 ? (
          <div className='flex justify-center items-center h-full'>
            No Transactions
          </div>
        ) : (
          <table className='w-full text-sm font-md text-left text-gray-500'>
            <thead className='text-md bg-gray-50'>
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    scope='col'
                    className='py-5 px-6 text-gray-500 font-semibold'
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className='bg-white border-b'>
                  <td className='py-5 px-6'>
                    <span className='text-gray-600'>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                    <br />
                    <span className='text-xs'>
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className='py-5 px-6'>{transaction.asset}</td>
                  <td className='gap-1 py-5 px-6 underline cursor-pointer'>
                    <div
                      className='flex gap-1 items-center'
                      onClick={() =>
                        window.open(
                          `https://nearblocks.io/txns/${transaction.txnId}`,
                          '_blank'
                        )
                      }
                    >
                      <span>
                        {`${transaction.txnId.slice(
                          0,
                          5
                        )}...${transaction.txnId.slice(-5)}`}
                      </span>
                      <SquareArrowOutUpRight size={16} />
                    </div>
                  </td>
                  <td className='py-5 px-6'>
                    {transaction.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {transactions.length > 0 && ( // Check if not loading and transactions exist
        <div className='p-8 flex flex-col gap-3 absolute bottom-0 w-full'>
          <div className='block lg:hidden flex justify-center'>
            <PageNumbers
              totalPages={totalPages}
              onPageChange={onPageChange}
              currentPage={currentPage}
            />
          </div>
          <div className='flex gap-2 flex-row justify-center'>
            <Button
              variant='outline'
              className='gap-2 min-w-32'
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <MoveLeft />
              <span>Previous</span>
            </Button>
            <div className='hidden lg:block'>
              <PageNumbers
                totalPages={totalPages}
                onPageChange={onPageChange}
                currentPage={currentPage}
              />
            </div>
            <Button
              variant='outline'
              className='gap-2 min-w-32'
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <MoveRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
