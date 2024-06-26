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
  projectDescription: string;
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
  status: string;
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
