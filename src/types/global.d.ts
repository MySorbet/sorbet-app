export {};

declare global {
  interface Window {
    rudderAnalytics: any;
  }
  interface Navigator {
    userAgentData?: {
      getHighEntropyValues(keys: string[]): Promise<{ [key: string]: string }>;
    };
  }
}
