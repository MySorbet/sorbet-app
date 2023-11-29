/* eslint-disable no-unsafe-optional-chaining */
import { Action, WalletSelector } from '@near-wallet-selector/core';
import { connect, keyStores, providers, WalletConnection } from 'near-api-js';

export const GetConfig = (environment = 'testnet') => {
  switch (environment) {
    case 'mainnet':
      return {
        headers: {},
        networkId: 'mainnet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      };
    case 'betanet':
      return {
        headers: {},
        networkId: 'betanet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
      };
    case 'testnet':
    default:
      return {
        headers: {},
        networkId: 'testnet',
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
  }
};

let wallet: any = null;
export const connectWallet = async () => {
  connect(GetConfig()).then(async (near) => {
    wallet = new WalletConnection(near, 'thrive-in');
    wallet.requestSignIn({ contractId: '' });
  });
};

export const disconnectWallet = async () => {
  (await wallet) && wallet.signOut();
};

interface ViewMethodParams {
  selector: WalletSelector;
  contractId?: any;
  method?: any;
  args?: any;
}

// Make a read-only call to retrieve information from the network
export const viewMethod = async ({
  selector,
  contractId,
  method,
  args = {},
}: ViewMethodParams) => {
  const { network } = selector?.options;
  const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

  const res: any = await provider.query({
    request_type: 'call_function',
    account_id: contractId,
    method_name: method,
    args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
    finality: 'optimistic',
  });
  return JSON.parse(Buffer.from(res.result).toString());
};

interface CallMethodParams {
  selector: WalletSelector;
  accountId?: string;
  contractId: string;
  method: any;
  args?: any;
  gas?: any;
  deposit?: any;
}

// Call a method that changes the contract's state
export const callMethod = async ({
  selector,
  accountId,
  contractId,
  method,
  args = {},
  gas,
  deposit,
}: CallMethodParams) => {
  const wallet = await selector?.wallet();
  const { network } = selector.options;

  const outcome: any = await wallet.signAndSendTransaction({
    signerId: accountId,
    receiverId: contractId,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: method,
          args,
          gas,
          deposit,
        },
      },
    ],
  });

  return providers.getTransactionLastResult(outcome);
};

// Call a method that changes the contract's state array.
export const callMethodBatch = async ({
  selector,
  accountId,
  contractId,
  method,
  args = [],
  gas,
  deposit,
}: CallMethodParams) => {
  const wallet = await selector?.wallet();

  const { network } = selector.options;

  const arrayActions: Action[] = [];
  for (let i = 0; i < args.length; i++) {
    arrayActions.push({
      type: 'FunctionCall',
      params: {
        methodName: method,
        args: args[i],
        gas,
        deposit,
      },
    });
  }

  const outcome: any = await wallet.signAndSendTransaction({
    signerId: accountId,
    receiverId: contractId,
    actions: arrayActions,
  });

  return providers.getTransactionLastResult(outcome);
};

// Get transaction result from the network
export const getTransactionResult = async (
  selector: WalletSelector,
  txhash: string
) => {
  const { network } = selector?.options;
  const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

  // Retrieve transaction result from the network
  const transaction = await provider.txStatus(txhash, 'unnused');
  return providers.getTransactionLastResult(transaction);
};
