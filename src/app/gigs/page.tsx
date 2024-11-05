import type { Metadata } from 'next';

import { featureFlags } from '@/lib/flags';

import { GigsContainer } from './gigs-container';
import { UnderDevelopment } from '@/components/common/under-development';

export const metadata: Metadata = {
  title: 'Gigs',
};

export default function GigsPage() {
  return (
    <>
      {featureFlags.gigs ? (
        <GigsContainer />
      ) : (
        <UnderDevelopment featureName='Gigs'/>
      )}
    </>
  );
}
