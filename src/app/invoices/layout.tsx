import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices',
  description:
    'Simple, secure, and fast payments. Pay invoices globally with near-zero fees.',
};

/** Noop layout. We just use this file to set metadata */
export default function Layout(props: React.PropsWithChildren) {
  return props.children;
}
