import { GigsContainer } from '../gigs-container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sorbet | Gigs',
};

export default function GigsPage() {
  return <GigsContainer />;
}
