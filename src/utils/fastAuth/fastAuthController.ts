import { fetchAccountIds } from '../../api/fastAuthApi';
import { network, networks } from '../../lib/config';
import { firebaseAuth } from './firebase';
import {
  CLAIM,
  getSignRequestFrpSignature,
  getUserCredentialsFrpSignature,
  verifyMpcSignature,
} from './mpc-service';
import type { NetworkId } from '@/types/network';
import { deleteOidcKeyPairOnLocalStorage } from '@/utils/fastAuth';
import { Account, Connection } from '@near-js/accounts';
import {
  createKey,
  getKeys,
  isPassKeyAvailable,
} from '@near-js/biometric-ed25519';
import { KeyPair, KeyPairEd25519, KeyType, PublicKey } from '@near-js/crypto';
import { InMemoryKeyStore } from '@near-js/keystores';
import {
  SCHEMA,
  actionCreators,
  encodeSignedDelegate,
  buildDelegateAction,
  Signature,
  SignedDelegate,
  signTransaction,
  SignedTransaction,
  Action,
} from '@near-js/transactions';
import { captureException } from '@sentry/react';
import BN from 'bn.js';
import { baseEncode, serialize, baseDecode } from 'borsh';
import { sha256 } from 'js-sha256';
import { keyStores } from 'near-api-js';
import { TypedError } from 'near-api-js/lib/utils/errors';

type NetworkConfig = {
  networkId: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
};

const { addKey, functionCallAccessKey } = actionCreators;
class FastAuthController {
  private accountId: string;

  private networkId: string;

  private keyStore: InMemoryKeyStore;

  private localStore: keyStores.BrowserLocalStorageKeyStore;

  private connection: Connection;

  constructor({
    accountId,
    networkId,
  }: {
    accountId: string;
    networkId: NetworkId;
  }) {
    const config = networks[networkId];
    if (!config) {
      throw new Error(`Invalid networkId ${networkId}`);
    }

    this.keyStore = new InMemoryKeyStore();
    this.localStore = new keyStores.BrowserLocalStorageKeyStore();

    this.connection = Connection.fromConfig({
      networkId,
      provider: { type: 'JsonRpcProvider', args: { url: config.nodeUrl } },
      signer: { type: 'InMemorySigner', keyStore: this.keyStore },
    });

    this.networkId = networkId;
    this.accountId = accountId;
  }

  setAccountId = (accountId: any) => {
    this.accountId = accountId;
  };

  async createBiometricKey() {
    const keyPair = await createKey(this.accountId);
    await this.setKey(keyPair);

    return keyPair;
  }

  async getCorrectAccessKey(firstKeyPair: any, secondKeyPair: any) {
    const firstPublicKeyB58 = `ed25519:${baseEncode(
      firstKeyPair.getPublicKey().data
    )}`;
    const secondPublicKeyB58 = `ed25519:${baseEncode(
      secondKeyPair.getPublicKey().data
    )}`;

    if (this.accountId) {
      const account = new Account(this.connection, this.accountId);
      const accessKeys = await account.getAccessKeys();
      const accessKey = accessKeys.find(
        (key) => key.public_key === firstPublicKeyB58 || secondPublicKeyB58
      );
      if (!accessKey) {
        throw new Error('No access key found');
      } else if (accessKey.public_key === firstPublicKeyB58) {
        return firstKeyPair;
      } else {
        return secondKeyPair;
      }
    }

    // If no account id, then we guess by checking if which key exists
    const accountIdsFromFirstKey = await fetchAccountIds(firstPublicKeyB58);
    if (accountIdsFromFirstKey.length) {
      this.setAccountId(accountIdsFromFirstKey[0]);
      return firstKeyPair;
    }
    const accountIdsFromSecondKey = await fetchAccountIds(secondPublicKeyB58);
    if (accountIdsFromSecondKey.length) {
      this.setAccountId(accountIdsFromSecondKey[0]);
      return secondKeyPair;
    }
    throw new Error('both key paris are invalid');
  }

  private async getBiometricKey() {
    const [firstKeyPair, secondKeyPair] = await getKeys(this.accountId);
    const privKeyStr = await this.getCorrectAccessKey(
      firstKeyPair,
      secondKeyPair
    );
    return new KeyPairEd25519(privKeyStr.split(':')[1]);
  }

  async getKey(key?: string) {
    const keypair = await this.keyStore.getKey(
      this.networkId,
      key || this.accountId
    );
    return keypair;
  }

  async setKey(keyPair: any) {
    return this.keyStore.setKey(this.networkId, this.accountId, keyPair);
  }

  async clearKey() {
    return this.keyStore.clear();
  }

  async clearUser() {
    await this.keyStore.clear();
  }

  async isSignedIn() {
    return !!(await this.getKey());
  }

  async getLocalStoreKey(accountId: any) {
    return this.localStore.getKey(this.networkId, accountId);
  }

  async findInKeyStores(key: any) {
    const keypair =
      (await this.getKey(key)) || (await this.getLocalStoreKey(key));
    return keypair;
  }

  assertValidSigner(signerId: any) {
    if (signerId && signerId !== this.accountId) {
      throw new Error(
        `Cannot sign transactions for ${signerId} while signed in as ${this.accountId}`
      );
    }
  }

  async getPublicKey() {
    let keyPair = await this.getKey();

    if (!keyPair) {
      const biometricKeyPair = await this.getBiometricKey();
      await this.setKey(biometricKeyPair);

      keyPair = biometricKeyPair;
    }

    return keyPair.getPublicKey().toString();
  }

  async fetchNonce({ accountId, publicKey }: any) {
    const rawAccessKey = await this.connection.provider.query({
      request_type: 'view_access_key',
      account_id: accountId,
      public_key: publicKey,
      finality: 'optimistic',
    });
    // @ts-expect-error ts-2339
    const nonce = rawAccessKey?.nonce;
    return new BN(nonce).add(new BN(1));
  }

  getAccountId() {
    return this.accountId;
  }

  async getAccounts() {
    if (this.accountId) {
      return [this.accountId];
    }

    return [];
  }

  async signDelegateAction({ receiverId, actions, signerId }: any) {
    this.assertValidSigner(signerId);
    let signedDelegate;
    try {
      // webAuthN supported browser
      const account = new Account(this.connection, this.accountId);
      signedDelegate = await account.signedDelegate({
        actions,
        blockHeightTtl: 60,
        receiverId,
      });
    } catch {
      // fallback, non webAuthN supported browser
      const oidcToken = await firebaseAuth?.currentUser?.getIdToken();
      const recoveryPK = await this.getUserCredential(oidcToken);
      // make sure to handle failure, (eg token expired) if fail, redirect to failure_url
      signedDelegate = await this.createSignedDelegateWithRecoveryKey({
        oidcToken,
        accountId: this.accountId,
        actions,
        recoveryPK,
      }).catch((err) => {
        console.log(err);
        captureException(err);
        throw new Error('Unable to sign delegate action');
      });
    }
    return signedDelegate;
  }

  async signTransaction({
    receiverId,
    actions,
    signerId,
  }: {
    receiverId: string;
    actions: Action[];
    signerId: string;
  }): Promise<[Uint8Array, SignedTransaction]> {
    this.assertValidSigner(signerId);
    const account = new Account(this.connection, this.accountId);

    const accessKeyInfo = await account.findAccessKey(receiverId, actions);
    if (!accessKeyInfo) {
      throw new TypedError(
        `Can not sign transactions for account ${this.accountId} on network ${this.connection.networkId}, no matching key pair exists for this account`,
        'KeyNotFound'
      );
    }
    const { accessKey } = accessKeyInfo;

    const block = await this.connection.provider.block({
      finality: 'final',
    });
    const blockHash = block.header.hash;

    const nonce = accessKey.nonce.add(new BN(1));

    if (await isPassKeyAvailable()) {
      return signTransaction(
        receiverId,
        nonce,
        actions,
        baseDecode(blockHash),
        this.connection.signer,
        this.accountId,
        this.connection.networkId
      );
    }

    throw new Error('Passkeys not supported');
  }

  async signMessage(payload: Uint8Array): Promise<{
    accountId: string;
    signature: Uint8Array;
    publicKey: string;
  }> {
    const signature = await this.connection.signer.signMessage(
      payload,
      this.accountId,
      this.networkId
    );

    const account = new Account(this.connection, this.accountId);
    const accessKeys = await account.getAccessKeys();
    const isFullAccessKey = accessKeys.some(
      (key) =>
        key.public_key === signature.publicKey.toString() &&
        key.access_key.permission === 'FullAccess'
    );

    if (!isFullAccessKey) {
      throw new Error('The public key used to sign is not a full access key');
    }

    return {
      accountId: this.accountId,
      signature: signature.signature,
      publicKey: signature.publicKey.toString(),
    };
  }

  async signAndSendDelegateAction({ receiverId, actions }: any) {
    const signedDelegate = await this.signDelegateAction({
      receiverId,
      actions,
      signerId: this.accountId,
    });
    return fetch(network.relayerUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(Array.from(encodeSignedDelegate(signedDelegate))),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).catch((err) => {
      console.log('Unable to sign and send delegate action', err);
      captureException(
        `Unable to sign and send delegate action, ${err.toString()}`
      );
    });
  }

  async signAndSendAddKey({
    contractId,
    methodNames,
    allowance,
    publicKey,
  }: any) {
    return this.signAndSendDelegateAction({
      receiverId: this.accountId,
      actions: [
        addKey(
          PublicKey.from(publicKey),
          functionCallAccessKey(contractId, methodNames || [], allowance)
        ),
      ],
    });
  }

  async getAllAccessKeysExceptRecoveryKey(
    odicToken: string
  ): Promise<string[]> {
    const account = new Account(this.connection, this.accountId);
    const accessKeys = await account.getAccessKeys();
    const recoveryKey = await this.getUserCredential(odicToken);
    return accessKeys
      .filter((key) => key.public_key !== recoveryKey)
      .map(({ public_key }) => public_key);
  }

  // This call need to be called after new oidc token is generated
  async claimOidcToken(oidcToken: string): Promise<{ mpc_signature: string }> {
    let keypair = await this.getKey(`oidc_keypair_${oidcToken}`);
    console.log({ keypair });
    if (!keypair) {
      keypair = KeyPair.fromRandom('ED25519');
      await this.keyStore.setKey(
        this.networkId,
        `oidc_keypair_${oidcToken}`,
        keypair
      );
      // Delete old oidc keypair
      deleteOidcKeyPairOnLocalStorage();
      await this.localStore.setKey(
        this.networkId,
        `oidc_keypair_${oidcToken}`,
        keypair
      );
    }

    const signature = getUserCredentialsFrpSignature({
      salt: CLAIM + 0,
      oidcToken,
      shouldHashToken: true,
      keypair,
    });

    const data = {
      oidc_token_hash: sha256(oidcToken),
      frp_signature: signature,
      frp_public_key: keypair.getPublicKey().toString(),
    };

    // https://github.com/near/mpc-recovery#claim-oidc-id-token-ownership
    try {
      const response = await fetch(
        `${network.fastAuth.mpcRecoveryUrl}/claim_oidc`,
        {
          method: 'POST',
          mode: 'cors' as const,
          body: JSON.stringify(data),
          headers: new Headers({ 'Content-Type': 'application/json' }),
        }
      );

      if (!response.ok) {
        throw new Error('Unable to claim OIDC token');
      }

      const res: {
        type: string;
        mpc_signature: string;
      } = await response.json();

      if (!verifyMpcSignature(res.mpc_signature, signature)) {
        throw new Error('MPC Signature is not valid');
      }

      return res;
    } catch (err) {
      console.log(err);
      captureException(err);
      throw new Error('Unable to claim OIDC token');
    }
  }

  async getUserCredential(oidcToken: any) {
    const GET_USER_SALT = CLAIM + 2;
    const keypair =
      (await this.getKey(`oidc_keypair_${oidcToken}`)) ||
      (await this.getLocalStoreKey(`oidc_keypair_${oidcToken}`));

    if (!keypair) {
      throw new Error('Unable to get oidc keypair');
    }

    const signature = getUserCredentialsFrpSignature({
      salt: GET_USER_SALT,
      oidcToken,
      shouldHashToken: false,
      keypair,
    });

    const data = {
      oidc_token: oidcToken,
      frp_signature: signature,
      frp_public_key: keypair.getPublicKey().toString(),
    };

    // https://github.com/near/mpc-recovery#user-credentials
    return fetch(`${network.fastAuth.mpcRecoveryUrl}/user_credentials`, {
      method: 'POST',
      mode: 'cors' as const,
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to get user credential');
        }
        const res = await response.json();
        return res.recovery_pk;
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Unable to get user credential');
      });
  }

  async getBlock() {
    return this.connection.provider.block({ finality: 'final' });
  }

  async createSignedDelegateWithRecoveryKey({
    oidcToken,
    accountId,
    recoveryPK,
    actions,
  }: any) {
    console.log({
      oidcToken,
      accountId,
      recoveryPK,
      actions,
    });
    const GET_SIGNATURE_SALT = CLAIM + 3;
    const GET_USER_SALT = CLAIM + 2;
    const localKey =
      (await this.getKey(`oidc_keypair_${oidcToken}`)) ||
      (await this.getLocalStoreKey(`oidc_keypair_${oidcToken}`));

    const { header } = await this.getBlock();
    const delegateAction = buildDelegateAction({
      actions,
      maxBlockHeight: new BN(header.height).add(new BN(60)),
      nonce: await this.fetchNonce({ accountId, publicKey: recoveryPK }),
      publicKey: PublicKey.from(recoveryPK),
      receiverId: accountId,
      senderId: accountId,
    });
    const encodedDelegateAction = Buffer.from(
      serialize(SCHEMA, delegateAction)
    ).toString('base64');
    const userCredentialsFrpSignature = getUserCredentialsFrpSignature({
      salt: GET_USER_SALT,
      oidcToken,
      shouldHashToken: false,
      keypair: localKey,
    });
    const signRequestFrpSignature = getSignRequestFrpSignature({
      salt: GET_SIGNATURE_SALT,
      oidcToken,
      keypair: localKey,
      delegateAction,
    });

    const payload = {
      delegate_action: encodedDelegateAction,
      oidc_token: oidcToken,
      frp_signature: signRequestFrpSignature,
      user_credentials_frp_signature: userCredentialsFrpSignature,
      frp_public_key: localKey.getPublicKey().toString(),
    };

    // https://github.com/near/mpc-recovery#sign
    return fetch(`${network.fastAuth.mpcRecoveryUrl}/sign`, {
      method: 'POST',
      mode: 'cors' as const,
      body: JSON.stringify(payload),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to get signature');
        }
        const res = await response.json();
        return res.signature;
      })
      .then((signature) => {
        const signatureObj = new Signature({
          keyType: KeyType.ED25519,
          data: Buffer.from(signature, 'hex'),
        });
        return new SignedDelegate({
          delegateAction,
          signature: signatureObj,
        });
      });
  }

  async signAndSendActionsWithRecoveryKey({
    oidcToken,
    accountId,
    recoveryPK,
    actions,
  }: any) {
    const signedDelegate = await this.createSignedDelegateWithRecoveryKey({
      oidcToken,
      accountId,
      recoveryPK,
      actions,
    }).catch((err) => {
      console.log(err);
      captureException(err);
      throw new Error('Unable to sign delegate action');
    });
    const encodedSignedDelegate = encodeSignedDelegate(signedDelegate);
    return fetch(network.relayerUrl, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(Array.from(encodedSignedDelegate)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).catch((err) => {
      console.log('Unable to sign and send action with recovery key', err);
      captureException(
        `Unable to sign and send action with recovery key, ${err.toString()}`
      );
    });
  }

  /**
   * Recovers the account ID and the recovery public key using an OIDC token.
   *
   * @param oidcToken - The OIDC token used for account recovery.
   * @returns A promise that resolves to an object containing the account ID and recovery public key, or undefined if no account IDs are found.
   */
  async recoverAccountWithOIDCToken(oidcToken: string): Promise<
    | undefined
    | {
        accountId: string;
        recoveryPK: string;
      }
  > {
    try {
      const recoveryPK = await this.getUserCredential(oidcToken);
      const accountIds = await fetchAccountIds(recoveryPK);

      if (accountIds.length > 0) {
        return {
          accountId: accountIds[0],
          recoveryPK,
        };
      }

      return undefined;
    } catch {
      return undefined;
    }
  }

  getConnection() {
    return this.connection;
  }
}

export default FastAuthController;

export const setAccountIdToController = ({
  accountId,
  networkId,
}: {
  accountId: string;
  networkId: NetworkId;
}) => {
  if (window.fastAuthController) {
    window.fastAuthController.setAccountId(accountId);
  } else {
    window.fastAuthController = new FastAuthController({
      accountId,
      networkId,
    });
  }
};
