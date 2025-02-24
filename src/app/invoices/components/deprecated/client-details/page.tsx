'use client';

import { ClientDetails } from '@/app/invoices/components/deprecated/create/client-details';
import { useAuth } from '@/hooks/use-auth';
import { User } from '@/types';

export default function CreateDetailsPage() {
  const { user } = useAuth();
  if (!user) {
    throw new Error('User not found');
  }
  const { firstName, lastName, email } = user as User;

  return (
    <ClientDetails
      name={`${firstName ?? ''} ${lastName ?? ''}`}
      email={email ?? ''}
    />
  );
}
