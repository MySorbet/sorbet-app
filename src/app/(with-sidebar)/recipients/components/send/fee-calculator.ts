import { DueFeeStructure } from '@/api/due/due';

export interface FeeBreakdown {
  sendAmount: number; // amount user enters (USDC)
  percentFee: number; // fee from basis points portion (USDC)
  fixedFee: number; // fixed fee portion (USDC)
  totalFee: number; // percentFee + fixedFee (USDC)
  amountAfterFee: number; // sendAmount - totalFee (USDC)
  receiveAmount: number; // final amount in destination currency
  sourceCurrency: string; // always 'USDC'
  destinationCurrency: string; // e.g., 'USD', 'EUR', 'AED'
  fxRate: number | null; // FX rate if cross-currency, null if USD
  isApproximate: boolean; // always true — actual fee is determined by Due at transfer time
}

/**
 * Calculate an approximate fee breakdown for an off-ramp transaction.
 *
 * The actual fee is determined by Due at transfer time; this is a best-effort
 * estimate using the fee structure and (optional) FX rate.
 */
export function calculateFeeBreakdown(
  sendAmount: number,
  feeStructure: DueFeeStructure,
  fxRate?: number | null
): FeeBreakdown {
  const feeBps = feeStructure.totalFeeBps;
  const feeFixed = parseFloat(feeStructure.totalFixedFee) || 0; // NaN guard

  const percentFee = (sendAmount * feeBps) / 10000;
  const totalFee = percentFee + feeFixed;
  const amountAfterFee = Math.max(0, sendAmount - totalFee);

  // For USDC->USD (pegged, 1:1), no FX conversion needed
  // For USDC->EUR, USDC->AED, etc., a real FX rate is required
  const sourceCurrency = 'USDC';
  const destinationCurrency = feeStructure.currencyCode;

  if (destinationCurrency !== 'USD') {
    if (fxRate == null || !Number.isFinite(fxRate)) {
      throw new Error('FX rate is required for non-USD fee breakdowns');
    }

    return {
      sendAmount,
      percentFee,
      fixedFee: feeFixed,
      totalFee,
      amountAfterFee,
      receiveAmount: amountAfterFee * fxRate,
      sourceCurrency,
      destinationCurrency,
      fxRate,
      isApproximate: true,
    };
  }

  return {
    sendAmount,
    percentFee,
    fixedFee: feeFixed,
    totalFee,
    amountAfterFee,
    receiveAmount: amountAfterFee,
    sourceCurrency,
    destinationCurrency,
    fxRate: null,
    isApproximate: true,
  };
}
