import { API_URL, runApi } from '@/utils';

import { ContractType } from '@/types';

export const createContract = async (data: ContractType) => {
  const res = await runApi('POST', `${API_URL}/contracts/create`, data);
  return res;
};

export const getMyContactsAsync = async (userId: string, role: string) => {
  const res = await runApi(
    'GET',
    `${API_URL}/contracts/myContracts/${userId}/${role}`
  );
  return res;
};
