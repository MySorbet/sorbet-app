import { useQuery } from '@tanstack/react-query';

export const useGenerateQRCode = (url: string) => {
  return useQuery({
    queryKey: ['qr-code', url],
    queryFn: async () => {
      const response = await fetch(
        `http://api.qrserver.com/v1/create-qr-code/?data=${url}&size=250x250)`
      );
      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }
      return response.blob();
    },
  });
};
