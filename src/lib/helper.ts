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

export const toYoctoNEAR = (amount: number) => {
  const yoctoMultiplier = BigInt('1000000000000000000000000'); // 10^24
  return (BigInt(amount) * yoctoMultiplier).toString();
};
