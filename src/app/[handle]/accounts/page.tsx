'use client';

import { PublicAccountsContent } from './components/public-accounts-content';

/**
 * Public accounts page at /{handle}/accounts.
 * Shows a user's bank account details in a shareable format.
 * No authentication required.
 */
const PublicAccountsPage = ({
  params,
}: {
  params: { handle: string };
}) => {
  return <PublicAccountsContent handle={params.handle} />;
};

export default PublicAccountsPage;
