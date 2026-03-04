export type CreateClientDto = {
  name: string;
  email: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export type UpdateClientDto = Partial<CreateClientDto>;

export type ClientAPI = {
  id: string;
  userId: string;
  name: string;
  email: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
};
