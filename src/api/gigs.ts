import axios from 'axios';

import { CreateContractType, CreateOfferType } from '@/types';
import { FindContractsType } from '@/types';
import { API_URL, withAuthHeader } from '@/utils';

export const findContractsWithFreelancer = async ({
  freelancerUsername,
  clientUsername,
}: FindContractsType) => {
  const reqBody = { freelancerUsername, clientUsername };

  try {
    const res = await axios.post(
      `${API_URL}/contracts/with-freelancer`,
      reqBody,
      withAuthHeader()
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

  try {
    const res = await axios.get(
      `${API_URL}/offers/createdFor/${freelancerUserId}${queryParams}`,
      withAuthHeader()
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

  try {
    const res = await axios.get(
      `${API_URL}/offers/createdBy/${clientId}${queryParams}`,
      withAuthHeader()
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get client offers: ${error.response.data.message}`
    );
  }
};

export const createContract = async (body: CreateContractType) => {
  try {
    const res = await axios.post(
      `${API_URL}/contracts`,
      body,
      withAuthHeader()
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to create contract: ${error.response.data.message}`
    );
  }
};

export const getContractsForFreelancer = async (status?: string) => {
  const queryParams = status ? `?status=${status}` : '';

  try {
    const res = await axios.get(
      `${API_URL}/contracts/freelance${queryParams}`,
      withAuthHeader()
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

  try {
    const res = await axios.post(
      `${API_URL}/offers/between-participants`,
      reqBody,
      withAuthHeader()
    );
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get client freelancer offers: ${error.response.data.message}`
    );
  }
};

export const getContractForOffer = async (offerId: string) => {
  try {
    const res = await axios.get(
      `${API_URL}/contracts/forOffer/${offerId}`,
      withAuthHeader()
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

  try {
    const res = await axios.patch(
      `${API_URL}/contracts/${contractId}/status`,
      reqBody,
      withAuthHeader()
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

  try {
    const res = await axios.patch(
      `${API_URL}/milestones/${milestoneId}/status`,
      reqBody,
      withAuthHeader()
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

  try {
    const res = await axios.patch(
      `${API_URL}/offers/status/${offerId}`,
      reqBody,
      withAuthHeader()
    );
    return res;
  } catch (error: any) {
    throw new Error(`Failed to reject offer: ${error.response.data.message}`);
  }
};

export const createOffer = async (body: CreateOfferType) => {
  const reqBody = body;

  try {
    const res = await axios.post(
      `${API_URL}/offers`,
      reqBody,
      withAuthHeader()
    );
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
