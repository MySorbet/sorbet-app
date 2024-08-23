import { useQuery } from '@tanstack/react-query';

export const useGenerateQRCode = (url: string) => {
  const svgEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${url}&format=svg`;
  const pngEndpoint = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${url}&format=png`;

  const { data: svgUrl, isPending: isSvgURLPending } = useQuery({
    queryKey: ['svg-qr-code'],
    queryFn: async () => {
      const response = await fetch(svgEndpoint);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
  });

  const { data: pngUrl, isPending: isPngURLPending } = useQuery({
    queryKey: ['png-qr-code'],
    queryFn: async () => {
      const response = await fetch(pngEndpoint);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    },
  });

  return {
    svgURL: svgUrl,
    pngURL: pngUrl,
    isPending: isSvgURLPending || isPngURLPending,
  };
};
