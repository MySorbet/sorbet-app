import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: `Profile`,
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  return children;
}
