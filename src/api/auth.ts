import { currentNetwork } from '@/lib/config';
import { SignInWithEmailTypes, SignUpWithEmailTypes } from '@/types/auth';
import { API_URL } from '@/utils';
import axios from 'axios';

export const signUpAsync = async ({
  firstName,
  lastName,
  email,
  accountId,
}: SignUpWithEmailTypes) => {
  try {
    const reqBody = { firstName, lastName, email, accountId };
    const res = await axios.post(`${API_URL}/auth/signup/email`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(`Failed to sign up: ${error.response.data.message}`);
  }
};

export const signInAsync = async ({ email }: SignInWithEmailTypes) => {
  try {
    const reqBody = { email };
    const res = await axios.post(`${API_URL}/auth/signin/email`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(`Failed to sign in: ${error.response.data.message}`);
  }
};

// [POST] /api/auth/signin
export const signInWithWallet = async (address: string) => {
  const reqBody = { address };
  try {
    const res = await axios.post(`${API_URL}/auth/signin/wallet`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to sign in with wallet: ${error.response.data.message}`
    );
  }
};

// [POST] /api/auth/signin
export const signUpWithWallet = async (
  address: string,
  email: string | null,
  phone: string | null
) => {
  const reqBody = { address, email, phone };

  try {
    const res = axios.post(`${API_URL}/auth/signup/wallet`, reqBody);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to sign up with wallet: ${error.response.data.message}`
    );
  }
};

export const fetchUserDetails = async (token: string) => {
  const headers = { Authorization: `Bearer ${token}` };
  const reqHeader = { headers };

  try {
    const res = await axios.get(`${API_URL}/auth/me`, reqHeader);
    return res;
  } catch (error: any) {
    throw new Error(
      `Failed to get user details: ${error.response.data.message}`
    );
  }
};

export const checkIsAccountAvailable = async (username: string) => {
  try {
    if (!username) return;

    const response = await fetch(currentNetwork.nodeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'view_account',
          finality: 'final',
          account_id: `${username}.${currentNetwork.fastAuth.accountIdSuffix}`,
        },
      }),
    });
    const data = await response.json();
    if (data?.error?.cause?.name == 'UNKNOWN_ACCOUNT') {
      // Account is available
      return true;
    }

    if (data?.result?.code_hash) {
      // Account is taken
      return false;
    }
  } catch (error: any) {
    // Error in checking availabilty, retry
    throw new Error(
      `Failed to check if account is available: ${error.response.data.message}`
    );
  }
};
