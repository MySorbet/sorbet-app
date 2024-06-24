import { CreateContractType, CreateOfferType, User } from '@/types';
import { FindContractsType } from '@/types';
import { API_URL, runApi } from '@/utils';

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

export const getFreelancerOffers = async (
  freelancerUserId: string,
  status?: string
) => {
  const queryParams = status ? `?status=${status}` : '';
  const res = await runApi(
    'GET',
    `${API_URL}/offers/createdFor/${freelancerUserId}${queryParams}`,
    {},
    {},
    true
  );
  return res;
};

export const getClientOffers = async (clientId: string, status?: string) => {
  const queryParams = status ? `?status=${status}` : '';
  const res = await runApi(
    'GET',
    `${API_URL}/offers/createdBy/${clientId}${queryParams}`,
    {},
    {},
    true
  );
  return res;
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

export const getContractForOffer = async (offerId: string) => {
  console.log('offerId', offerId);
  const res = await runApi(
    'GET',
    `${API_URL}/contracts/forOffer/${offerId}`,
    {},
    {},
    true
  );
  return res;
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

export const updateMilestoneStatus = async (
  milestoneId: string,
  status: string
) => {
  const reqBody = { status };
  const res = await runApi(
    'PATCH',
    `${API_URL}/milestones/${milestoneId}/status`,
    reqBody,
    {},
    true
  );
  return res;
};

export const updateOfferStatus = async (offerId: string, status: string) => {
  const reqBody = { status };
  const res = await runApi(
    'PATCH',
    `${API_URL}/offers/status/${offerId}`,
    reqBody,
    {},
    true
  );
  return res;
};

export const createOffer = async (body: CreateOfferType) => {
  const reqBody = body;
  const res = await runApi('POST', `${API_URL}/offers`, reqBody, {}, true);
  return res;
};
