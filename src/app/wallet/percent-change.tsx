import { TrendDown01, TrendUp01 } from '@untitled-ui/icons-react';

interface PercentageChangeProps {
  percentChange: number;
}

export const PercentageChange: React.FC<PercentageChangeProps> = ({
  percentChange,
}) => {
  return (
    <div className='ml-2 flex'>
      {percentChange > 0 ? (
        <TrendUp01 color='#079455' />
      ) : (
        <TrendDown01 color='#dc2626' />
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
