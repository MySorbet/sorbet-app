import { type UseQueryOptions, useQuery } from '@tanstack/react-query';

import { getDueBankDetails } from '@/api/due/due';
import type {
  DueVirtualAccountAEDDetails,
  DueVirtualAccountEURDetails,
  DueVirtualAccountSWIFTDetails,
  DueVirtualAccountUSDetails,
} from '@/types/due';

// ─── Rail → schema mapping ────────────────────────────────────────────────────

export type VirtualPaymentRail =
  | 'usd_ach'
  | 'usd_wire'
  | 'usd_swift'
  | 'eur_sepa'
  | 'eur_swift'
  | 'aed_local';

const RAIL_TO_DUE_SCHEMA: Record<VirtualPaymentRail, string> = {
  usd_ach: 'bank_us',
  usd_wire: 'bank_us',
  usd_swift: 'bank_swift_usd',
  eur_sepa: 'bank_sepa',
  eur_swift: 'bank_sepa',
  aed_local: 'bank_mena',
};

// ─── Discriminated union for typed raw bank data ──────────────────────────────

export type DueBankDetailsForRail =
  | { rail: 'usd_ach'; data: DueVirtualAccountUSDetails }
  | { rail: 'usd_wire'; data: DueVirtualAccountUSDetails }
  | { rail: 'usd_swift'; data: DueVirtualAccountSWIFTDetails }
  | { rail: 'eur_sepa'; data: DueVirtualAccountEURDetails }
  | { rail: 'eur_swift'; data: DueVirtualAccountEURDetails }
  | { rail: 'aed_local'; data: DueVirtualAccountAEDDetails };

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Fetch the raw Due bank account details for the specific virtual payment rail
 * chosen when the invoice was created.
 *
 * - Fires exactly **one** request (the schema is derived from the rail).
 * - Returns raw typed data — 
 * - Pass `enabled: false` to skip the fetch (e.g. when `virtualPaymentRail` is absent).
 */
export const useDueBankDetailsForRail = (
  userId: string,
  rail: string | undefined | null,
  options?: Partial<UseQueryOptions<unknown>>
): { data: DueBankDetailsForRail | undefined; isLoading: boolean } => {
  const validRail = isValidRail(rail) ? rail : undefined;
  const schema = validRail ? RAIL_TO_DUE_SCHEMA[validRail] : undefined;

  const query = useQuery<unknown>({
    queryKey: ['dueBankDetails', userId, schema],
    queryFn: () => getDueBankDetails(userId, schema!),
    enabled: !!userId && !!validRail && !!schema,
    ...options,
  });

  if (!validRail || !query.data) {
    return { data: undefined, isLoading: query.isLoading };
  }

  return {
    data: { rail: validRail, data: query.data } as DueBankDetailsForRail,
    isLoading: query.isLoading,
  };
};

function isValidRail(rail: string | undefined | null): rail is VirtualPaymentRail {
  return (
    rail === 'usd_ach' ||
    rail === 'usd_wire' ||
    rail === 'usd_swift' ||
    rail === 'eur_sepa' ||
    rail === 'eur_swift' ||
    rail === 'aed_local'
  );
}
