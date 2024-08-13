import { CreateContractType, CreateOfferType } from '@/types';
import { FindContractsType } from '@/types';
import { API_URL, validateToken } from '@/utils';
import axios from 'axios';

export const findContractsWithFreelancer = async ({
  freelancerUsername,
  clientUsername,
}: FindContractsType) => {
  const reqBody = { freelancerUsername, clientUsername };
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.post(
      `${API_URL}/contracts/with-freelancer`,
      reqBody,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to find contracts with freelancer: ${error.response.data.message}`
    );
  }
};

export const getFreelancerOffers = async (
  freelancerUserId: string,
  status?: string
) => {
  const queryParams = status ? `?status=${status}` : '';
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.get(
      `${API_URL}/offers/createdFor/${freelancerUserId}${queryParams}`,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get freelancer offers: ${error.response.data.message}`
    );
  }
};

export const getClientOffers = async (clientId: string, status?: string) => {
  const queryParams = status ? `?status=${status}` : '';
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.get(
      `${API_URL}/offers/createdBy/${clientId}${queryParams}`,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get client offers: ${error.response.data.message}`
    );
  }
};

export const createContract = async (body: CreateContractType) => {
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.post(`${API_URL}/contracts`, body, reqHeader);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to create contract: ${error.response.data.message}`
    );
  }
};

export const getContractsForFreelancer = async (status?: string) => {
  const queryParams = status ? `?status=${status}` : '';
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.get(
      `${API_URL}/contracts/freelance${queryParams}`,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get contracts for freelancer: ${error.response.data.message}`
    );
  }
};

export const getClientFreelancerOffers = async (
  freelancerUsername: string,
  clientUsername: string
) => {
  const reqBody = { freelancerUsername, clientUsername };
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.post(
      `${API_URL}/offers/between-participants`,
      reqBody,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get client freelancer offers: ${error.response.data.message}`
    );
  }
};

export const getContractForOffer = async (offerId: string) => {
  const reqHeader = validateToken({}, true);
  try {
    const res = await axios.get(
      `${API_URL}/contracts/forOffer/${offerId}`,
      reqHeader
    );
    return res;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to contract for offer: ${error.response?.data.message}`
      );
    }
    throw new Error(`Request getContractForOffer failed: ${error}`);
  }
};

export const updateContractStatus = async (
  contractId: string,
  status: string
) => {
  const reqBody = { status };
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.patch(
      `${API_URL}/contracts/${contractId}/status`,
      reqBody,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to update contract status: ${error.response.data.message}`
    );
  }
};

export const updateMilestoneStatus = async (
  milestoneId: string,
  status: string
) => {
  const reqBody = { status };
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.patch(
      `${API_URL}/milestones/${milestoneId}/status`,
      reqBody,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to update milestone status: ${error.response.data.message}`
    );
  }
};

export const updateOfferStatus = async (offerId: string, status: string) => {
  const reqBody = { status };
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.patch(
      `${API_URL}/offers/status/${offerId}`,
      reqBody,
      reqHeader
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to reject offer: ${error.response.data.message}`);
  }
};

export const createOffer = async (body: CreateOfferType) => {
  const reqBody = body;
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.post(`${API_URL}/offers`, reqBody, reqHeader);
    return res;
  } catch (error: any) {
    throw new Error(`Failed to create offer: ${error.response.data.message}`);
  }
};

export const getOfferById = async (offerId: string) => {
  const reqHeader = validateToken({}, true);

  try {
    const res = await axios.get(`${API_URL}/offers/${offerId}`, reqHeader);
    return res;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Axios error: failed to get offer by id: ${error.response?.data.error}`
      );
    }
    throw new Error(`Non-axios error: failed to get offer by id ${error}`);
  }
};
