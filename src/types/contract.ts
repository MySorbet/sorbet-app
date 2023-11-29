import UserType from '@/types/user';

export enum ProjectStatus {
  Pending,
  InProgress,
  Completed,
}
export interface ContractType {
  id?: string;
  jobTitle?: string;
  jobDescription?: string;
  startTime?: string;
  budget?: string;
  freelancerId?: string;
  clientId?: string;
  client?: UserType;
  freelancer?: UserType;
  projectId?: string;
  status?: ProjectStatus;
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
  status: ProjectStatus.Pending,
};

export const defaultMileStone: MileStoneType = {
  name: '',
  amount: 0,
};
