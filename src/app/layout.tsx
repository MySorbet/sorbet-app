'use client';

import '@/styles/colors.css';
import '@/styles/globals.css';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Providers from '@/app/providers';

import Head from './head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  // Redirect to signin if not authenticated. Since this is on Root Layout, this will apply for all pages.
  // TODO: Revisit auth strategy and how this plays with Splash, Container, and useAuth
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/signin');
    }
  }, [ready, authenticated, router]);

  return (
    <html className='size-full'>
      <Head />
      <body className='size-full bg-[#F2F3F7]'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
