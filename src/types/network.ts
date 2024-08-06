export type NetworkId = ProductionNetwork['networkId'];
export type Network = ProductionNetwork;

type ProductionNetwork = {
  networkId: 'testnet' | 'mainnet';
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
