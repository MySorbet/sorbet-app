import UserType from '@/types/user';

export interface ContractType {
  id: string;
  jobTitle: string;
  jobDescription: string;
  startTime: string;
  budget: string;
  freelancerId: string;
  clientId: string;
  client?: UserType;
  freelancer?: UserType;
  projectId?: string;
}

export interface MileStoneType {
  name: string;
  amount: number;
}

export const defaultContract: ContractType = {
  id: '',
  jobTitle: '',
  jobDescription: '',
  startTime: 'With in the next week',
  budget: '$500-$1000',
  freelancerId: '',
  clientId: '',
};

export const defaultMileStone: MileStoneType = {
  name: '',
  amount: 0,
};
