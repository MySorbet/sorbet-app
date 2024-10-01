import { MAX_BIO_LENGTH } from '@/constant';

export const BioMessage = ({
  length,
  isMax,
}: {
  length: number;
  isMax: boolean;
}) => {
  return isMax ? (
    <p className='animate-in slide-in-from-top-1 fade-in-0 mt-1 text-xs text-red-500'>
      Max of {MAX_BIO_LENGTH} characters
    </p>
  ) : (
    <p className='mt-1 text-xs text-[#344054]'>{length}/100</p>
  );
};
