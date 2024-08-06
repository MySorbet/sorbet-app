/* eslint-disable no-unused-vars */
import FastAuthController from '@/utils/fastAuth';
import FirestoreController from '@/utils/fastAuth';

export {};

declare global {
  interface Window {
    fastAuthController: FastAuthController;
    firestoreController: FirestoreController;
    rudderAnalytics: any;
  }
  interface Navigator {
    userAgentData?: {
      getHighEntropyValues(keys: string[]): Promise<{ [key: string]: string }>;
    };
  }
}
