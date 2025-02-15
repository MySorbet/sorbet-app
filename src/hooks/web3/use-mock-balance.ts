import { useEffect, useState } from 'react';

export const useMockBalance = () => {
  const [loading, setLoading] = useState(true);
  const [usdcBalance, setUsdcBalance] = useState<string>('1,329');
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setUsdcBalance('1,329');
    }, 1000);
  }, []);
  return { loading, usdcBalance };
};
