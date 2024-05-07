import { ReactNode } from 'react';

export const metadata = () => {
  return {
    title: `Sorbet | Profile`,
  };
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  return children;
}
