import { parse } from 'date-fns';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface BalanceChartProps {
  balanceHistory: { date: string; balance: number }[] | undefined;
}

/** The graph of balance history underneath the balance widget in the wallet page */
export const BalanceChart: React.FC<BalanceChartProps> = ({
  balanceHistory,
}) => {
  // sort everything in ascending order since transactions are ordered by block number, and not necessarily timestamp
  // (according to the docs: https://docs.moralis.com/web3-data-api/evm/reference/get-token-transfers)
  const sortedBalanceHistory = balanceHistory?.sort((a, b) => {
    const dateA = parse(a.date, 'M/d/yyyy, h:mm:ss a', new Date());
    const dateB = parse(b.date, 'M/d/yyyy, h:mm:ss a', new Date());
    return dateA.getTime() - dateB.getTime();
  });

  // get highest balance value for setting y axis domain
  const maxBalance = Math.max(
    ...(sortedBalanceHistory?.map((item) => item.balance) || [0])
  );

  return (
    <ResponsiveContainer width='100%' height={200}>
      <AreaChart
        data={sortedBalanceHistory}
        margin={{ top: 0, right: 0, left: -60, bottom: 0 }}
      >
        <defs>
          <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#573DF5' stopOpacity={0.3} />
            <stop offset='95%' stopColor='#573DF5' stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis dataKey='date' tick={false} axisLine={false} />
        <YAxis axisLine={false} tick={false} domain={[0, maxBalance + 100]} />

        <Area
          type='monotone'
          dataKey='balance'
          stroke='#573DF5'
          fillOpacity={1}
          fill='url(#colorUv)'
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
