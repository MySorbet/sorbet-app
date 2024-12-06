import type { Metadata } from 'next';

import { UnderDevelopment } from '@/components/common/under-development';
import { featureFlags } from '@/lib/flags';

import { GigsContainer } from './gigs-container';

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
