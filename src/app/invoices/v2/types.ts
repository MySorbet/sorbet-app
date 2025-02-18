export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  address?: Address;
};
