import type { Metadata } from 'next';

import { GigsContainer } from '../gigs-container';

export const metadata: Metadata = {
  title: 'Gigs',
};

export default function GigsPage() {
  return <GigsContainer />;
}
