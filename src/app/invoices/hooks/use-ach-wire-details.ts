import { useQuery } from '@tanstack/react-query';

import { getACHWireDetails } from '@/api/bridge';
import { SourceDepositInstructions } from '@/types';

// TODO: Have to make this grab the ACH info for any user, not the logged in user
export const useACHWireDetails = (userId: string) => {
  const query = useQuery({
    queryKey: ['achWireDetails', userId],
    queryFn: () => getACHWireDetails(userId),
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

const mapToACHWireDetails = (
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
