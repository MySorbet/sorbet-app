'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'hsl(var(--sorbet))',
  },
} satisfies ChartConfig;

export type BalanceHistory = { iso: string; balance: number }[];

// TODO: Add a groupByMonth mode for "All time" duration
// TODO: Improve loading state

/**
 * Renders a chart of the balance history as a beautiful shadcn chart
 *
 * Note that the chart includes its own `mx-8` and `my-4`.
 * Account for this when rendering it in a padded container
 */
export function BalanceChart({ history }: { history?: BalanceHistory }) {
  return (
    <div>
      <ChartContainer config={chartConfig} className='max-h-64 min-h-52 w-full'>
        <AreaChart
          accessibilityLayer
          data={history}
          margin={{ left: 32, right: 32, top: 16, bottom: 16 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='iso'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatDate}
            interval='preserveStartEnd'
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
            labelFormatter={formatDate}
          />
          <defs>
            <linearGradient id='fillBalance' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='5%'
                stopColor='var(--color-balance)'
                stopOpacity={0.8}
              />
              <stop
                offset='95%'
                stopColor='var(--color-balance)'
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey='balance'
            type='monotone'
            fill='url(#fillBalance)'
            fillOpacity={0.4}
            stroke='var(--color-balance)'
            stackId='a'
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate().toString();
  return `${month} ${day}`;
};
