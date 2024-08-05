import { User } from '@/types/user';

export interface FindContractsType {
  freelancerUsername: string;
  clientUsername: string;
}

export interface CreateContractType {
  name: string;
  totalAmount?: number;
  contractType: string;
  clientUsername: string;
  offerId: string;
  milestones?: CreateMilestoneType[];
}

export interface CreateMilestoneType {
  name: string;
  amount: number;
}

export interface OfferType {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  status: string;
  tags: string[];
  projectName: string;
  projectStart?: string;
  budget?: string;
  projectDescription: string;
  recipient?: User;
  creator?: User;
}

export enum ContractMilestoneStatus {
  FundingPending = 'FundingPending',
  Active = 'Active',
  InReview = 'InReview',
  Approved = 'Approved',
}

export interface ContractType {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  startDate: string;
  expectedEndDate: string;
  contractType: string;
  status: string;
  freelanceId: string;
  clientId: string;
  dateCreated: string;
  dateUpdated: string;
  offerId: string;
  client?: User;
  freelancer?: User;
  channelId: string;
}

export interface MilestoneType {
  id: string;
  name: string;
  description: string;
  startDate: string;
  expectedEndDate: string;
  contractId: string;
  dateCreated: string;
  dateUpdated: string;
  amount: number;
  status: ContractMilestoneStatus;
}

export interface CreateOfferType {
  projectName: string;
  description: string;
  budget: number;
  projectStart: string;
  clientUsername: string;
  freelancerUsername: string;
}

export enum GigsContentType {
  Sent,
  Received,
}

const ContractStatuses = [
  'PendingApproval',
  'NotStarted',
  'InProgress',
  'InReview',
  'Completed',
  'Rejected',
] as const;
export type ContractStatus = (typeof ContractStatuses)[number];
