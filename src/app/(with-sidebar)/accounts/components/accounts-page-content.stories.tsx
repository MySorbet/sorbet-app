import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { http, HttpResponse } from 'msw';

import {
  mockACHWireDetailsHandler,
  mockBridgeCustomerHandler,
} from '@/api/bridge';
import { mockUser } from '@/api/user';
import AuthProvider from '@/hooks/use-auth';

import { AccountsPageContent } from './accounts-page-content';

const meta = {
  title: 'Accounts/AccountsPageContent',
  component: AccountsPageContent,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [mockBridgeCustomerHandler, mockACHWireDetailsHandler],
    },
  },
} satisfies Meta<typeof AccountsPageContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state - user needs to complete verification
 */
export const Default: Story = {};

/**
 * Restricted country user - shows all accounts as "Coming Soon"
 * User from a country where USD and EUR accounts are not available
 */
export const RestrictedCountry: Story = {
  decorators: [
    (Story) => (
      <AuthProvider
        value={{
          user: { ...mockUser, country: 'China' }, // Restricted country
          logout: fn(),
          login: fn(),
          loading: false,
          dangerouslySetUser: fn(),
        }}
      >
        <Story />
      </AuthProvider>
    ),
  ],
};

/**
 * User with USD account enabled
 */
export const WithUSDAccount: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/bridge/customer', () => {
          return HttpResponse.json({
            customer: {
              status: 'approved',
            },
            virtual_account: {
              id: 'va-123',
              source_deposit_instructions: {
                ach: {
                  account_number: '1234567890',
                  routing_number: '021000021',
                },
                wire: {
                  account_number: '1234567890',
                  routing_number: '021000021',
                },
              },
            },
          });
        }),
        mockACHWireDetailsHandler,
      ],
    },
  },
};

/**
 * User with both USD and EUR accounts enabled
 */
export const WithBothAccounts: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/bridge/customer', () => {
          return HttpResponse.json({
            customer: {
              status: 'approved',
            },
            virtual_account: {
              id: 'va-123',
              source_deposit_instructions: {
                ach: {
                  account_number: '1234567890',
                  routing_number: '021000021',
                },
                wire: {
                  account_number: '1234567890',
                  routing_number: '021000021',
                },
              },
            },
            virtual_account_eur: {
              id: 'va-eur-123',
              source_deposit_instructions: {
                iban: 'GB29NWBK60161331926819',
                bic: 'NWBKGB2L',
              },
            },
          });
        }),
        mockACHWireDetailsHandler,
      ],
    },
  },
};
