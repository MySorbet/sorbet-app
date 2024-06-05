import { getWidgetContent } from '@/lib/service';
import { WidgetType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useGetWidgetContent = () => {
  return useQuery({
    queryKey: ['widget-content'],
    queryFn: () => (url: string, type: WidgetType) =>
      getWidgetContent({ url, type }),
  });
};
