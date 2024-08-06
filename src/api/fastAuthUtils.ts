import { withTimeout } from '../utils';
import { network, networkId } from '../utils/config';
import { CLAIM, getUserCredentialsFrpSignature } from '../utils/mpc-service';
import { LimitedAccessKey, NewAccountResponse } from './fastAuthTypes';
import { captureException } from '@sentry/react';
import { KeyPair } from 'near-api-js';

const fetchAccountIdFromQueryApi = async (
  publicKey: string
): Promise<string | null> => {
  const query = `query AccountIdByPublicKey {
    dataplatform_near_access_keys_v1_access_keys_v1(
      where: {public_key: {_eq: "${publicKey}"}, deleted_by_receipt_id: {_is_null: true}, account_deleted_by_receipt_id: {_is_null: true}}
    ) {
      account_id
      public_key
      created_by_receipt_id
      last_updated_block_height
    }
  }`;

  if (!network.fastAuth.queryApiUrl) {
    throw new Error('queryApiUrl is undefined');
  }

  try {
    const res = await fetch(network.fastAuth.queryApiUrl, {
      method: 'POST',
      headers: { 'x-hasura-role': 'dataplatform_near' },
      body: JSON.stringify({
        query,
        variables: {},
        operationName: 'AccountIdByPublicKey',
      }),
    });
    if (res.ok) {
      const response = await res.json();
      if (response.data) {
        const data =
          response.data.dataplatform_near_access_keys_v1_access_keys_v1[0];
        return data?.account_id;
      }
    }
  } catch (e) {
    // Not tracking error here because it is possible that the public key is not on chain
    console.log(
      `Fail to retrieve account id with public key ${publicKey} from queryAPI: ${e}`
    );
  }
  return null;
};

/**
 * Fetches the account IDs associated with a given public key.
 *
 * @param publicKey - The public key to fetch the account IDs for.
 * @returns A promise that resolves to an array of account IDs.
 * @throws Will throw an error if the fetch request fails.
 */
const KIT_WALLET_WAIT_DURATION = 10000; // 10s
export const fetchAccountIds = async (publicKey: string): Promise<string[]> => {
  if (publicKey) {
    if (window.firestoreController) {
      console.log('window.firestoreController', publicKey);
      const accountId =
        await window.firestoreController.getAccountIdByPublicKey(publicKey);
      // const accountId = "davidjin.testnet";
      console.log('window.firestoreController', accountId);
      if (accountId) {
        return [accountId];
      }
    }

    // Currently fast near only support mainnet, once it supports testnet, we need to update this condition
    if (networkId === 'mainnet') {
      const accountId = await fetchAccountIdFromQueryApi(publicKey);
      console.log('accountId', accountId);
      if (accountId) {
        return [accountId];
      }
    }

    try {
      const res = await withTimeout(
        fetch(
          `${network.fastAuth.authHelperUrl}/publicKey/${publicKey}/accounts`
        ),
        KIT_WALLET_WAIT_DURATION
      );
      if (res) {
        const ids = await res.json();
        return ids;
      }
      return [];
    } catch (error) {
      console.log('Unable to fetch account ids:', error);
      captureException(error);
      return [];
    }
  }

  return [];
};

/**
 * This function fetches account id from given two public keys.
 * Webuathn currently prompts two public keys by default and we need to discover which key is currently on chain.
 * Since we store public key <-> account id in firestore, one of the public key will return the result fast and we do not need to wait for both request to resolve.
 * It is possible that both public keys are not on chain, in that case we return null.
 * @param keyPairA
 * @param keyPairB
 * @returns object with account id and public key
 */
export const fetchAccountIdsFromTwoKeys = async (
  keyPairA: KeyPair,
  keyPairB: KeyPair
): Promise<{ accId: string; keyPair: KeyPair } | null> => {
  const accountIdsFromPublicKeyA = fetchAccountIds(
    keyPairA.getPublicKey().toString()
  );
  const accountIdsFromPublicKeyB = fetchAccountIds(
    keyPairB.getPublicKey().toString()
  );

  const firstResult = await Promise.race([
    accountIdsFromPublicKeyA,
    accountIdsFromPublicKeyB,
  ]);
  const firstKey =
    firstResult === (await accountIdsFromPublicKeyA) ? keyPairA : keyPairB;
  if (firstResult.length > 0) {
    return {
      accId: firstResult[0],
      keyPair: firstKey,
    };
  }

  const secondResult = await (firstResult === (await accountIdsFromPublicKeyA)
    ? accountIdsFromPublicKeyB
    : accountIdsFromPublicKeyA);
  const secondKey = firstKey === keyPairA ? keyPairB : keyPairA;
  if (secondResult.length > 0) {
    return {
      accId: secondResult[0],
      keyPair: secondKey,
    };
  }

  return null;
};

/**
 * This function creates a new account on the NEAR blockchain by sending a request to the /new_account endpoint of the MPC recovery service.
 *
 * @param accountId - The ID of the new account to be created on the NEAR blockchain.
 * @param fullAccessKeys - An array of full access keys to be added to the account.
 * @param limitedAccessKeys - An array of objects, each representing a limited access key to be associated with the account. Each object has the following properties:
 * - public_key: The public key of the limited access key.
 * - receiver_id: The contract_ID that the limited access key is authorized to call.
 * - allowance: The maximum amount of NEAR tokens that the limited access key is allowed to spend on gas fees.
 * - method_names: A string of comma-separated method names that the limited access key is allowed to call.
 * @param accessToken - The OIDC access token.
 * @param oidcKeypair - The public and private key pair of the FRP.
 * @returns A promise that resolves to an object of type NewAccountResponse. This object contains the result of the account creation process. It can either be of type 'ok' with the account details or of type 'err' with an error message.
 * @throws An error if the fetch request fails.
 */
export const createNEARAccount = async ({
  accountId,
  fullAccessKeys = [],
  limitedAccessKeys = [],
  accessToken,
  oidcKeypair,
}: {
  accountId: string;
  fullAccessKeys?: string[];
  limitedAccessKeys?: LimitedAccessKey[];
  accessToken: string;
  oidcKeypair: KeyPair;
}): Promise<NewAccountResponse> => {
  console.log({
    accountId,
    fullAccessKeys,
    limitedAccessKeys,
    accessToken,
    oidcKeypair,
  });
  const CLAIM_SALT = CLAIM + 2;
  const signature = getUserCredentialsFrpSignature({
    salt: CLAIM_SALT,
    oidcToken: accessToken,
    shouldHashToken: false,
    keypair: oidcKeypair,
  });

  const data = {
    near_account_id: accountId,
    create_account_options: {
      full_access_keys: fullAccessKeys,
      limited_access_keys: limitedAccessKeys,
    },
    oidc_token: accessToken,
    user_credentials_frp_signature: signature,
    frp_public_key: oidcKeypair.getPublicKey().toString(),
  };

  const options = {
    method: 'POST',
    mode: 'cors' as const,
    body: JSON.stringify(data),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  };

  const response = await fetch(
    `${network.fastAuth.mpcRecoveryUrl}/new_account`,
    options
  );
  if (!response?.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
