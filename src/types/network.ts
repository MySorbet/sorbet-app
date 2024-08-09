export const NetworkIds = ['testnet', 'mainnet'] as const;
export type NetworkId = (typeof NetworkIds)[number];

export type Network = {
  networkId: NetworkId;
  viewAccountId: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  relayerUrl: string;
  fastAuth: {
    mpcRecoveryUrl: string;
    authHelperUrl: string; // TODO refactor: review by fastauth team
    accountIdSuffix: string;
    queryApiUrl: string;
    firebase: {
      apiKey: string;
      fastAuthDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId: string;
    };
  };
};
