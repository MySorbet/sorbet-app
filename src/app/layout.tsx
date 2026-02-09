import '@/styles/globals.css';

import { Metadata } from 'next';
import { Inter, Jura } from 'next/font/google';
import { Suspense } from 'react';

import PostHogPageView from '@/app/posthog-page-view';
import { cn } from '@/lib/utils';

import Providers from './providers';

/** Docs on metadata object options: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields */
export const metadata: Metadata = {
  metadataBase: new URL('https://mysorbet.io'),
  title: {
    default: 'Sorbet | Same-Day Payments in USDC, USD & EUR',
    template: 'Sorbet | %s',
  },
  description:
    'Global payments made simple: free sign-up, near-zero fees, and complete flexibility for freelancers and small businesses with global clients.',
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

const jura = Jura({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jura',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // classnames prevent horizontal layout shift when radix models open
    <html
      className={cn(
        'h-full w-screen overflow-x-hidden',
        inter.className,
        jura.variable
      )}
    >
      <body className='bg-background size-full'>
        <Suspense>
          <PostHogPageView />
        </Suspense>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
