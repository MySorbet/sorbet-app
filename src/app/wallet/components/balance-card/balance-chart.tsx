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

interface BalanceChartProps {
  history?: BalanceHistory;
}
// TODO: Add a groupByMonth mode
// TODO Sick loading animation

/** Renders a chart of the balance history as a beautiful shadcn chart */
export function BalanceChart({ history }: BalanceChartProps) {
  return (
    <div>
      <ChartContainer config={chartConfig} className='min-h-[200px]'>
        <AreaChart
          accessibilityLayer
          data={history}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='iso'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatDate}
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
            type='natural'
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
