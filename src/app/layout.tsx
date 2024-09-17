import '@/styles/colors.css';
import '@/styles/globals.css';

import Providers from '@/app/providers';

import Head from './head';

/** Docs on metadata object options: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields */
export const metadata = {
  metadataBase: new URL('https://www.mysorbet.io'),
  title: {
    default: 'Sorbet | The All-in One Payment Experience for Freelancers',
    template: 'Sorbet | %s',
  },
  description:
    'Unlock your global creative potential with Sorbet. A secure and trustworthy tool here to support you throughout your freelancing journey.',
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
