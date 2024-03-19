import { runApi } from '@/utils';
import { GetBehanceItemType, GetDribbleShotType, WidgetType } from '@/types';
import { config } from '@/lib/config';

export const getWidgetContent = async ({ url, type }: { url: string; type: WidgetType }) => {
  switch (type) {
    case WidgetType.Dribbble:
      return getDribbleShot({ url });

    case WidgetType.Behance:
      return getBehanceItem({ url });
  }
};

export const getDribbleShot = async({ url }: GetDribbleShotType) => {
  const body: GetDribbleShotType = { url };
  const response = await runApi('POST', `${config.devApiUrl}/widgets/dribbble`, body);
  return response;
};

export const getBehanceItem = async({ url }: GetBehanceItemType) => {
  const body: GetBehanceItemType = { url };
  const response = await runApi('POST', `${config.devApiUrl}/widgets/behance`, body);
  return response;
};