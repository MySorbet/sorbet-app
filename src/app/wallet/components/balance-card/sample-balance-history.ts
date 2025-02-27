import { sampleTransactions } from '@/api/transactions/sample-transactions';

import { BalanceHistory } from './balance-chart';
import { mapTransactionsToBalanceHistory } from './util';

export const balanceHistorySimple: BalanceHistory = [
  { iso: new Date('2024-01-01').toISOString(), balance: 100 },
  { iso: new Date('2024-01-02').toISOString(), balance: 150 },
  { iso: new Date('2024-01-03').toISOString(), balance: 125 },
  { iso: new Date('2024-01-04').toISOString(), balance: 175 },
  { iso: new Date('2024-01-05').toISOString(), balance: 200 },
  { iso: new Date('2024-01-06').toISOString(), balance: 180 },
  { iso: new Date('2024-01-07').toISOString(), balance: 220 },
];

export const balanceHistoryComplex: BalanceHistory = [
  { iso: new Date('2024-01-01').toISOString(), balance: 1000 },
  { iso: new Date('2024-01-02').toISOString(), balance: 1250 },
  { iso: new Date('2024-01-03').toISOString(), balance: 950 },
  { iso: new Date('2024-01-04').toISOString(), balance: 1100 },
  { iso: new Date('2024-01-05').toISOString(), balance: 1300 },
  { iso: new Date('2024-01-06').toISOString(), balance: 1150 },
  { iso: new Date('2024-01-07').toISOString(), balance: 1400 },
  { iso: new Date('2024-01-08').toISOString(), balance: 1250 },
  { iso: new Date('2024-01-09').toISOString(), balance: 1500 },
  { iso: new Date('2024-01-10').toISOString(), balance: 1350 },
  { iso: new Date('2024-01-11').toISOString(), balance: 1600 },
  { iso: new Date('2024-01-12').toISOString(), balance: 1450 },
];

export const balanceHistoryGrowth: BalanceHistory = [
  { iso: new Date('2024-01-01').toISOString(), balance: 500 },
  { iso: new Date('2024-01-02').toISOString(), balance: 520 },
  { iso: new Date('2024-01-03').toISOString(), balance: 650 },
  { iso: new Date('2024-01-04').toISOString(), balance: 630 },
  { iso: new Date('2024-01-05').toISOString(), balance: 700 },
  { iso: new Date('2024-01-06').toISOString(), balance: 750 },
  { iso: new Date('2024-01-07').toISOString(), balance: 900 },
  { iso: new Date('2024-01-08').toISOString(), balance: 1100 },
  { iso: new Date('2024-01-09').toISOString(), balance: 1050 },
  { iso: new Date('2024-01-10').toISOString(), balance: 1200 },
];

export const balanceHistoryVolatile: BalanceHistory = [
  { iso: new Date('2024-01-01').toISOString(), balance: 2000 },
  { iso: new Date('2024-01-02').toISOString(), balance: 1500 },
  { iso: new Date('2024-01-03').toISOString(), balance: 2200 },
  { iso: new Date('2024-01-04').toISOString(), balance: 1800 },
  { iso: new Date('2024-01-05').toISOString(), balance: 2500 },
  { iso: new Date('2024-01-06').toISOString(), balance: 2000 },
  { iso: new Date('2024-01-07').toISOString(), balance: 2800 },
  { iso: new Date('2024-01-08').toISOString(), balance: 2300 },
  { iso: new Date('2024-01-09').toISOString(), balance: 3000 },
  { iso: new Date('2024-01-10').toISOString(), balance: 2600 },
  { iso: new Date('2024-01-11').toISOString(), balance: 3200 },
  { iso: new Date('2024-01-12').toISOString(), balance: 2800 },
  { iso: new Date('2024-01-13').toISOString(), balance: 3500 },
  { iso: new Date('2024-01-14').toISOString(), balance: 3000 },
];

export const balanceHistoryDecline: BalanceHistory = [
  { iso: new Date('2024-01-01').toISOString(), balance: 5000 },
  { iso: new Date('2024-01-02').toISOString(), balance: 4800 },
  { iso: new Date('2024-01-03').toISOString(), balance: 4900 },
  { iso: new Date('2024-01-04').toISOString(), balance: 4600 },
  { iso: new Date('2024-01-05').toISOString(), balance: 4400 },
  { iso: new Date('2024-01-06').toISOString(), balance: 4500 },
  { iso: new Date('2024-01-07').toISOString(), balance: 4200 },
  { iso: new Date('2024-01-08').toISOString(), balance: 4000 },
  { iso: new Date('2024-01-09').toISOString(), balance: 3800 },
  { iso: new Date('2024-01-10').toISOString(), balance: 3900 },
  { iso: new Date('2024-01-11').toISOString(), balance: 3600 },
  { iso: new Date('2024-01-12').toISOString(), balance: 3400 },
];

// This could be the data for "all time" month grouping
const balanceHistoryAllTime = [
  { month: 'January', balance: 186 },
  { month: 'February', balance: 305 },
  { month: 'March', balance: 237 },
  { month: 'April', balance: 73 },
  { month: 'May', balance: 209 },
  { month: 'June', balance: 214 },
];

export const balanceHistoryFromSampleTransactions: BalanceHistory =
  mapTransactionsToBalanceHistory(sampleTransactions);
