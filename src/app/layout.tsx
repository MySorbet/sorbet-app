import '@/styles/colors.css';
import '@/styles/globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ClientProviders } from '@/app/client-providers';
import { cn } from '@/lib/utils';

import Head from './head';

/** Docs on metadata object options: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields */
export const metadata: Metadata = {
  title: {
    default: 'Sorbet | The All-in One Payment Experience for Freelancers',
    template: 'Sorbet | %s',
  },
  description:
    'Unlock your global creative potential with Sorbet. A secure and trustworthy tool here to support you throughout your freelancing journey.',
  keywords: [
    'social network',
    'BASE blockchain',
    'collaboration',
    'creators',
    'ai',
  ],
};

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
