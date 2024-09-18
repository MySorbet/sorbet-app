import '@/styles/colors.css';
import '@/styles/globals.css';

import { Inter } from 'next/font/google';

import { ClientProviders } from '@/app/client-providers';
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
  return (
    <html className={cn('size-full', inter.className)}>
      <Head />
      <body className='size-full bg-[#F2F3F7]'>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
