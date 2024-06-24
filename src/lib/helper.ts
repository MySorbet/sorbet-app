import BigNumber from 'bignumber.js';

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export const toYoctoNEAR = (amount: string): string => {
  return new BigNumber(amount).multipliedBy('1e24').toString();
};
