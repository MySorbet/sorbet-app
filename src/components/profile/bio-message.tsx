import { MAX_BIO_LENGTH } from '@/constant';

/**
 * This component displays character count as well as an error message if bio length is exceeded
 * @param length number length of the bio
 * @param isMax boolean indicating whether the bio has exceeded the maximum bio length
 * @returns
 */
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
