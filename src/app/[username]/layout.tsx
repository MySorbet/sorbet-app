import { ReactNode } from 'react';

//@ts-ignore
export const metadata = () => {
  return {
    title: `Sorbet | Profile`,
  };
};

export default function ClientLayout({ children }: { children: ReactNode }) {
  return children;
}
