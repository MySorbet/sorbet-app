import axios from 'axios';

import { env } from '@/lib/env';

import { withAuthHeader } from './withAuthHeader';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

type XYWH = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type LayoutDto = XYWH & {
  id: string;
  breakpoint: 'sm' | 'lg';
};

type CreateWidgetDto = {
  id: string;
  url: string;
  layouts: {
    sm: XYWH;
    lg: XYWH;
  };
};

export type UpdateLayoutsDto = {
  layouts: LayoutDto[];
};

export type ApiWidget = {
  id: string;
  href?: string;
  title?: string;
  iconUrl?: string;
  contentUrl?: string;
  custom?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  layouts: LayoutDto[];
};

export const widgetsV2Api = {
  /** Create a new widget */
  create: async (data: CreateWidgetDto) => {
    const response = await axios.post(
      `${API_URL}/v2/widgets`,
      data,
      await withAuthHeader()
    );
    return response.data;
  },

  /** Update widget layouts */
  updateLayouts: async (data: UpdateLayoutsDto) => {
    await axios.put(
      `${API_URL}/v2/widgets/layouts`,
      data,
      await withAuthHeader()
    );
  },

  /** Delete a widget */
  delete: async (id: string) => {
    await axios.delete(`${API_URL}/v2/widgets/${id}`, await withAuthHeader());
  },

  /** Get widgets by handle */
  getByHandle: async (handle: string) => {
    const response = await axios.get(`${API_URL}/v2/widgets?handle=${handle}`);
    return response.data;
  },

  /** Get widgets by userId */
  getByUserId: async (userId: string) => {
    const response = await axios.get(`${API_URL}/v2/widgets?userId=${userId}`);
    return response.data;
  },

  /** Get widgets by privyId */
  getByPrivyId: async (privyId: string) => {
    const response = await axios.get(
      `${API_URL}/v2/widgets?privyId=${privyId}`
    );
    return response.data;
  },
};
