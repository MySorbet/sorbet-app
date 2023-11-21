import UserType from "@/types/user";

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