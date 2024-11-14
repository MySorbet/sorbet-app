import { useQuery } from '@tanstack/react-query';

export const useACHWireDetails = (userId: string) => {
  return useQuery({
    queryKey: ['achWireDetails'],
    queryFn: getACHWireDetails,
  });
};

// TODO: Remove this mock data, we can get this from the Bridge virtual account API and store it
// https://apidocs.bridge.xyz/docs/virtual-accounts
const getACHWireDetails = async () => {
  // TODO: Fetch this based on the authed users token
  return {
    routingNumber: '123456789',
    accountNumber: '123456789',
    beneficiary: {
      name: 'John Doe',
      accountType: 'Checking',
      address: '123 Main St, Anytown, USA',
    },
    bank: {
      name: 'Bank of America',
      address: '123 Main St, Anytown, USA',
    },
  };
};
