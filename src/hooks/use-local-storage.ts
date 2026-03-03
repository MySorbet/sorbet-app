import { useCallback, useState } from 'react';

export const useLocalStorage = <T = unknown>(
  keyName: string,
  defaultValue: T
) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value) as T;
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  });


  const setValue = useCallback(
    (newValue: T) => {
      try {
        window.localStorage.setItem(keyName, JSON.stringify(newValue));
        setStoredValue(newValue);
      } catch (err) {
        console.error(err);
      }
    },
    [keyName]
  );

  return [storedValue, setValue] as const;
};
