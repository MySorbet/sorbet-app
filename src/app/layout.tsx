import '@/styles/globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';

import PostHogPageView from '@/app/posthog-page-view';
import { cn } from '@/lib/utils';

import Providers from './providers';

/** Docs on metadata object options: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields */
export const metadata: Metadata = {
  metadataBase: new URL('https://mysorbet.io'),
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
  authors: [{ name: 'Sorbet' }],
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
    // classnames prevent horizontal layout shift when radix models open
    <html className={cn('h-full w-screen overflow-x-hidden', inter.className)}>
      <body className='bg-background size-full'>
        <Suspense>
          <PostHogPageView />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
