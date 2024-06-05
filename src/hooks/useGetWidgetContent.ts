import { getWidgetContent } from '@/lib/service';
import { WidgetType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetWidgetContent = () => {
  return useMutation({
    mutationFn: ({ url, type }: { url: string; type: WidgetType }) =>
      getWidgetContent({ url, type }),
  });
};
