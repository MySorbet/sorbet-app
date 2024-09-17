import '@/styles/colors.css';
import '@/styles/globals.css';

import Providers from '@/app/providers';

import Head from './head';

export const metadata = {
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className='size-full'>
      {/* <Head /> */}
      <body className='size-full bg-[#F2F3F7]'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
