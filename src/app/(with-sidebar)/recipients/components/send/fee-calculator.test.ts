import { DueFeeStructure } from '@/api/due/due';

import { calculateFeeBreakdown } from './fee-calculator';

/** Helper to create a minimal DueFeeStructure for testing */
function makeFeeStructure(
  overrides: Partial<DueFeeStructure> = {}
): DueFeeStructure {
  return {
    paymentMethod: 'usd_ach',
    rail: 'ach',
    currencyCode: 'USD',
    channelType: 'withdrawal',
    accountType: 'individual',
    dueFeeBps: 0,
    dueFixedFee: '0',
    sorbetFeeBps: 0,
    sorbetFixedFee: '0',
    totalFeeBps: 50, // 0.50%
    totalFixedFee: '1.00',
    duePurposeRequired: false,
    speed: '1-2 business days',
    limitMin: '1',
    limitMax: '10000',
    syncedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('calculateFeeBreakdown', () => {
  it('calculates normal fee for USD recipient', () => {
    const feeStructure = makeFeeStructure({
      totalFeeBps: 50, // 0.50%
      totalFixedFee: '1.00',
      currencyCode: 'USD',
    });

    const result = calculateFeeBreakdown(100, feeStructure);

    // 100 * 0.005 = 0.50 bps fee + 1.00 fixed = 1.50 total fee
    expect(result.sendAmount).toBe(100);
    expect(result.percentFee).toBe(0.5);
    expect(result.fixedFee).toBe(1);
    expect(result.totalFee).toBe(1.5);
    expect(result.amountAfterFee).toBe(98.5);
    expect(result.receiveAmount).toBe(98.5); // 100 - 1.50
    expect(result.sourceCurrency).toBe('USDC');
    expect(result.destinationCurrency).toBe('USD');
    expect(result.fxRate).toBeNull(); // USD->USD, no FX
    expect(result.isApproximate).toBe(true);
  });

  it('returns zero receive amount when fee exceeds send amount', () => {
    const feeStructure = makeFeeStructure({
      totalFeeBps: 0,
      totalFixedFee: '5.00',
      currencyCode: 'USD',
    });

    const result = calculateFeeBreakdown(3, feeStructure);

    expect(result.totalFee).toBe(5);
    expect(result.amountAfterFee).toBe(0); // Math.max(0, 3 - 5) = 0
    expect(result.receiveAmount).toBe(0); // Math.max(0, 3 - 5) = 0
  });

  it('handles zero amount', () => {
    const feeStructure = makeFeeStructure();
    const result = calculateFeeBreakdown(0, feeStructure);

    expect(result.sendAmount).toBe(0);
    expect(result.percentFee).toBe(0);
    expect(result.fixedFee).toBe(1);
    expect(result.totalFee).toBe(1); // only fixed fee
    expect(result.amountAfterFee).toBe(0);
    expect(result.receiveAmount).toBe(0);
  });

  it('applies FX rate for non-USD currency', () => {
    const feeStructure = makeFeeStructure({
      totalFeeBps: 100, // 1%
      totalFixedFee: '0',
      currencyCode: 'EUR',
    });

    const result = calculateFeeBreakdown(100, feeStructure, 0.92);

    // 100 * 0.01 = 1.00 fee, net = 99, 99 * 0.92 = 91.08
    expect(result.percentFee).toBe(1);
    expect(result.fixedFee).toBe(0);
    expect(result.totalFee).toBe(1);
    expect(result.amountAfterFee).toBe(99);
    expect(result.receiveAmount).toBeCloseTo(91.08, 2);
    expect(result.destinationCurrency).toBe('EUR');
    expect(result.fxRate).toBe(0.92);
  });

  it('throws when FX rate is null for non-USD currency', () => {
    const feeStructure = makeFeeStructure({
      totalFeeBps: 0,
      totalFixedFee: '0',
      currencyCode: 'AED',
    });

    expect(() => calculateFeeBreakdown(100, feeStructure, null)).toThrow(
      'FX rate is required for non-USD fee breakdowns'
    );
  });

  it('throws when FX rate is undefined for non-USD currency', () => {
    const feeStructure = makeFeeStructure({
      totalFeeBps: 0,
      totalFixedFee: '0',
      currencyCode: 'AED',
    });

    expect(() => calculateFeeBreakdown(100, feeStructure, undefined)).toThrow(
      'FX rate is required for non-USD fee breakdowns'
    );
  });

  it('handles NaN in totalFixedFee', () => {
    const feeStructure = makeFeeStructure({
      totalFeeBps: 100, // 1%
      totalFixedFee: 'invalid',
      currencyCode: 'USD',
    });

    const result = calculateFeeBreakdown(100, feeStructure);

    // NaN guard should treat invalid as 0
    expect(result.percentFee).toBe(1);
    expect(result.fixedFee).toBe(0);
    expect(result.totalFee).toBe(1); // only bps fee
    expect(result.amountAfterFee).toBe(99);
    expect(result.receiveAmount).toBe(99);
  });

  it('handles zero bps and zero fixed fee', () => {
    const feeStructure = makeFeeStructure({
      totalFeeBps: 0,
      totalFixedFee: '0',
      currencyCode: 'USD',
    });

    const result = calculateFeeBreakdown(500, feeStructure);

    expect(result.totalFee).toBe(0);
    expect(result.amountAfterFee).toBe(500);
    expect(result.receiveAmount).toBe(500);
  });

  it('shows null fxRate for USD destination regardless of rate param', () => {
    const feeStructure = makeFeeStructure({
      currencyCode: 'USD',
    });

    const result = calculateFeeBreakdown(100, feeStructure, 1.0);

    expect(result.fxRate).toBeNull();
  });

  it('shows fxRate for non-USD destination', () => {
    const feeStructure = makeFeeStructure({
      currencyCode: 'EUR',
      totalFeeBps: 0,
      totalFixedFee: '0',
    });

    const result = calculateFeeBreakdown(100, feeStructure, 0.85);

    expect(result.fxRate).toBe(0.85);
    expect(result.amountAfterFee).toBe(100);
    expect(result.receiveAmount).toBe(85);
  });

  it('handles large amounts correctly', () => {
    const feeStructure = makeFeeStructure({
      totalFeeBps: 25, // 0.25%
      totalFixedFee: '2.50',
      currencyCode: 'USD',
    });

    const result = calculateFeeBreakdown(10000, feeStructure);

    // 10000 * 0.0025 = 25 bps fee + 2.50 fixed = 27.50
    expect(result.percentFee).toBe(25);
    expect(result.fixedFee).toBe(2.5);
    expect(result.totalFee).toBe(27.5);
    expect(result.amountAfterFee).toBe(9972.5);
    expect(result.receiveAmount).toBe(9972.5);
  });

  it('handles fxRate of zero (produces zero receive amount)', () => {
    const feeStructure = makeFeeStructure({
      totalFeeBps: 0,
      totalFixedFee: '0',
      currencyCode: 'EUR',
    });

    const result = calculateFeeBreakdown(100, feeStructure, 0);

    expect(result.fxRate).toBe(0);
    expect(result.amountAfterFee).toBe(100);
    expect(result.receiveAmount).toBe(0); // 100 * 0 = 0
  });
});
