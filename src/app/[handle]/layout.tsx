import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: `Profile`,
};

/** Noop layout. We just use this file to set metadata */
export default function Layout(props: React.PropsWithChildren) {
  return props.children;
}
