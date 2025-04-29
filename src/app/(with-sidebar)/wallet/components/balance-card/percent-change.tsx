import { TrendingDown, TrendingUp } from 'lucide-react';

interface PercentageChangeProps {
  percentChange: number;
}

export const PercentageChange: React.FC<PercentageChangeProps> = ({
  percentChange,
}) => {
  return (
    <div className='ml-2 flex'>
      {percentChange > 0 ? (
        <TrendingUp color='#079455' />
      ) : (
        <TrendingDown color='#dc2626' />
      )}
      <div
        className={`text-md ml-1 ${
          percentChange > 0 ? 'text-[#079455]' : 'text-red-600'
        }`}
      >
        {percentChange > 0
          ? `+${percentChange.toFixed(2)}%`
          : `-${percentChange.toFixed(2)}%`}
      </div>
    </div>
  );
};
