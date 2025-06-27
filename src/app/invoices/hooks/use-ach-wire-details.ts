import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getACHWireDetails } from '@/api/bridge';
import {
  SourceDepositInstructions,
  SourceDepositInstructionsEUR,
} from '@/types';

export const useACHWireDetails = (
  userId: string,
  options?: Partial<UseQueryOptions<SourceDepositInstructions>>
) => {
  const query = useQuery({
    queryKey: ['achWireDetails', userId],
    queryFn: () => getACHWireDetails(userId),
    ...options,
  });

  const mappedData = query.data ? mapToACHWireDetails(query.data) : undefined;

  return {
    ...query,
    data: mappedData,
  };
};

export type ACHWireDetails = {
  routingNumber: string;
  accountNumber: string;
  beneficiary: {
    name: string;
    accountType: string;
    address: string;
  };
  bank: {
    name: string;
    address: string;
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

export const mapToACHWireDetails = (
  instructions: SourceDepositInstructions
): ACHWireDetails => ({
  routingNumber: instructions.bank_routing_number,
  accountNumber: instructions.bank_account_number,
  beneficiary: {
    name: instructions.bank_beneficiary_name,
    accountType: 'Checking', // Defaulting to "Checking" since it's not provided in the source data
    address: instructions.bank_beneficiary_address,
  },
  bank: {
    name: instructions.bank_name,
    address: instructions.bank_address,
  },
});
