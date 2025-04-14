import axios from 'axios';

import { env } from '@/lib/env';

import { withAuthHeader } from '../withAuthHeader';
import {
  ApiWidget,
  CreateWidgetDto,
  UpdateLayoutsDto,
  UpdateWidgetDto,
} from './types';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

export const widgetsV2Api = {
  /** Create a new widget */
  create: async (data: CreateWidgetDto) => {
    const response = await axios.post<ApiWidget>(
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
    const response = await axios.get<ApiWidget[]>(
      `${API_URL}/v2/widgets?handle=${handle}`
    );
    return response.data;
  },

  /** Get widgets by userId */
  getByUserId: async (userId: string) => {
    const response = await axios.get<ApiWidget[]>(
      `${API_URL}/v2/widgets?userId=${userId}`
    );
    return response.data;
  },

  /** Get widgets by privyId */
  getByPrivyId: async (privyId: string) => {
    const response = await axios.get<ApiWidget[]>(
      `${API_URL}/v2/widgets?privyId=${privyId}`
    );
    return response.data;
  },

  /** Enrich a widget */
  enrich: async (id: string) => {
    const response = await axios.post<ApiWidget>(
      `${API_URL}/v2/widgets/${id}/enrich`,
      {}, // No data on the post, just hitting the endpoint enriches the widget
      await withAuthHeader()
    );
    return response.data;
  },

  /** Update a widget */
  update: async (id: string, data: UpdateWidgetDto) => {
    const response = await axios.put<ApiWidget>(
      `${API_URL}/v2/widgets/${id}`,
      data,
      await withAuthHeader()
    );
    return response.data;
  },
};
