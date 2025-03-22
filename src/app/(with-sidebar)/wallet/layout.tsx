import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Wallet`,
};

/** Noop layout. We just use this file to set metadata */
export default function Layout(props: React.PropsWithChildren) {
  return props.children;
}
