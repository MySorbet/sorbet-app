import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getSEPADetails } from '@/api/bridge';
import { SourceDepositInstructionsEUR } from '@/types';

export const useSEPADetails = (
  userId: string,
  options?: Partial<UseQueryOptions<SourceDepositInstructionsEUR>>
) => {
  const query = useQuery({
    queryKey: ['sepaDetails', userId],
    queryFn: () => getSEPADetails(userId),
    ...options,
  });

  const mappedData = query.data ? mapToEURWireDetails(query.data) : undefined;

  return {
    ...query,
    data: mappedData,
  };
};

export type SEPADetails = {
  iban: string;
  bic: string;
  accountHolderName: string;
  bank: {
    name: string;
    address: string;
  };
};

export const mapToEURWireDetails = (
  instructions: SourceDepositInstructionsEUR
): SEPADetails => ({
  iban: instructions.iban,
  bic: instructions.bic,
  accountHolderName: instructions.account_holder_name,
  bank: {
    name: instructions.bank_name,
    address: instructions.bank_address,
  },
});
