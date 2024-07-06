import { CreateContractType, CreateOfferType, User } from '@/types';
import { FindContractsType } from '@/types';
import { API_URL, getFormatedResponse, runApi, validateToken } from '@/utils';
import axios from 'axios';

export const findContractsWithFreelancer = async ({
  freelancerUsername,
  clientUsername,
}: FindContractsType) => {
  const reqBody = { freelancerUsername, clientUsername };
  const res = await runApi(
    'POST',
    `${API_URL}/contracts/with-freelancer`,
    reqBody,
    {},
    true
  );
  return res;
};

// export const findContractsWithFreelancer = async ({ freelancerUsername, clientUsername }: FindContractsType) => {
//   const reqBody = { freelancerUsername, clientUsername }
//   const apiReqHeader = validateToken({}, true)

//   try {
//     const res = await axios.post(`${API_URL}/contracts/with-freelancer`, reqBody, apiReqHeader)
//     return res
//   } catch (error: any) {
//     throw new Error(error.response.data.message)
//   }
// }

export const getFreelancerOffers = async (
  freelancerUserId: string,
  status?: string
) => {
  const queryParams = status ? `?status=${status}` : '';
  const apiReqHeaders = validateToken({}, true);

  try {
    const res = await axios.get(
      `${API_URL}/offers/createdFor/${freelancerUserId}${queryParams}`,
      apiReqHeaders
    );
    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getClientOffers = async (clientId: string, status?: string) => {
  const queryParams = status ? `?status=${status}` : '';
  const apiReqHeaders = validateToken({}, true);

  try {
    const res = await axios.get(
      `${API_URL}/offers/createdBy/${clientId}${queryParams}`,
      apiReqHeaders
    );
    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createContract = async (body: CreateContractType) => {
  const res = await runApi(
    'POST',
    `${API_URL}/contracts`,
    body,
    undefined,
    true
  );
  return res;
};

// export const createContract = async (body: CreateContractType) => {
//   const apiReqHeader = validateToken({}, true)

//   try {
//     const res = await axios.post(`${API_URL}/contracts`, body, apiReqHeader)
//     return res
//   } catch (error: any) {
//     throw new Error(error.response.data.message)
//   }
// }

export const getContractsForFreelancer = async (status?: string) => {
  const queryParams = status ? `?status=${status}` : '';
  const res = await runApi(
    'GET',
    `${API_URL}/contracts/freelance${queryParams}`,
    {},
    {},
    true
  );
  return res;
};

// export const getContractsForFreelancer = async (status?: string) => {
//   const queryParams = status ? `?status=${status}` : ''
//   const apiReqHeader = validateToken({}, true)

//   try {
//     const res = await axios.get(`${API_URL}/contracts/freelance${queryParams}`, apiReqHeader)
//     return res
//   } catch (error: any) {
//     throw new Error(error.response.data.message)
//   }
// }

export const getClientFreelancerOffers = async (
  freelancerUsername: string,
  clientUsername: string
) => {
  const reqBody = { freelancerUsername, clientUsername };
  const res = await runApi(
    'POST',
    `${API_URL}/offers/between-participants`,
    reqBody,
    {},
    true
  );
  return res;
};

// export const getClientFreelancerOffers = async (freelancerUsername: string, clientUsername: string) => {
//   const reqBody = { freelancerUsername, clientUsername }
//   const apiReqHeader = validateToken({}, true)

//   try {
//     const res = await axios.post(`${API_URL}/offers/between-participants`, reqBody, apiReqHeader)
//     return res
//   } catch (error: any) {
//     throw new Error(error.response.data.message)
//   }
// }

export const getContractForOffer = async (offerId: string) => {
  const apiReqHeaders = validateToken({}, true);
  try {
    const res = await axios.get(
      `${API_URL}/contracts/forOffer/${offerId}`,
      apiReqHeaders
    );
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const updateContractStatus = async (
  contractId: string,
  status: string
) => {
  const reqBody = { status };
  const res = await runApi(
    'PATCH',
    `${API_URL}/contracts/${contractId}/status`,
    reqBody,
    {},
    true
  );
  return res;
};

// export const updateContractStatus = async (contractId: string, status: string) => {
//   const reqBody = { status }
//   const apiReqHeader = validateToken({}, true)

//   try {
//     const res = await axios.patch(`${API_URL}/contracts/${contractId}/status`, reqBody, apiReqHeader)
//     return res
//   } catch (error: any) {
//     throw new Error(error.response.data.message)
//   }
// }

export const updateOfferStatus = async (offerId: string, status: string) => {
  const reqBody = { status };
  const apiReqHeaders = validateToken({}, true);

  try {
    const res = await axios.patch(
      `${API_URL}/offers/status/${offerId}`,
      reqBody,
      apiReqHeaders
    );
    return res;
  } catch (error: any) {
    throw new Error('Failed to reject offer');
  }
};

export const createOffer = async (body: CreateOfferType) => {
  const reqBody = body;
  const res = await runApi('POST', `${API_URL}/offers`, reqBody, {}, true);
  return res;
};

// export const createOffer = async (body: CreateOfferType) => {
//   const reqBody = body
//   const apiReqHeader = validateToken({}, true)

//   try {
//     const res = await axios.post(`${API_URL}/offers`, reqBody, apiReqHeader)
//     return res
//   } catch (error: any) {
//     throw new Error(error.response.data.message)
//   }
// }
