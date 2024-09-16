'use client';

import '@/styles/colors.css';
import '@/styles/globals.css';

import { usePrivy } from '@privy-io/react-auth';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import Providers from '@/app/providers';
import { cn } from '@/lib/utils';

import Head from './head';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  // Redirect to signin if not authenticated. Since this is on Root Layout, this will apply for all pages.
  // TODO: Revisit auth strategy and how this plays with Splash, Authenticated wrapper, and useAuth
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/signin');
    }
  }, [ready, authenticated, router]);

  return (
    <html className={cn('size-full', inter.className)}>
      <Head />
      <body className='size-full bg-[#F2F3F7]'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
