import { GigsContainer } from './gigs-container';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gigs',
};

export default function GigsPage() {
  return <GigsContainer />;
}
