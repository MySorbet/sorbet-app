import { runApi } from '@/utils';
import { GetBehanceItemType, GetDribbleShotType, GetMediumArticleType, GetYouTubeVideoType, WidgetType } from '@/types';
import { config } from '@/lib/config';

export const getWidgetContent = async ({ url, type }: { url: string; type: WidgetType }) => {
  switch (type) {
    case WidgetType.Dribbble:
      return getDribbleShot({ url });

    case WidgetType.Behance:
      return getBehanceItem({ url });

    case WidgetType.Medium:
      return getMediumArticleMetadata({ url });

    case WidgetType.Youtube:
      return getYouTubeVideoMetadata({ url });
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

export const getMediumArticleMetadata = async({ url }: GetMediumArticleType) => {
  const body: GetMediumArticleType = { url };
  const response = await runApi('POST', `${config.devApiUrl}/widgets/medium`, body);
  return response;
};

export const getYouTubeVideoMetadata = async({ url }: GetYouTubeVideoType) => {
  const body: GetYouTubeVideoType = { url };
  const response = await runApi('POST', `${config.devApiUrl}/widgets/youtube`, body);
  return response;
};