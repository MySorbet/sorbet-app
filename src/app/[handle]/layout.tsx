import { Metadata } from 'next';

import { env } from '@/lib/env';
import { formatName } from '@/lib/utils';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

/** Dynamic metadata and open graph data for users profiles */
export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const user = await fetch(`${API_URL}/users/handle/${params.handle}`, {
    cache: 'no-store', // No store because we need to get the latest user
  }).then((res) => res.json());
  const title = formatName(user.firstName, user.lastName) ?? user.handle;
  const description =
    user.bio ??
    'Check out my Sorbet profile. One link-in-bio where I showcase my work and get paid.';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

/** Noop layout. We just use this file to set metadata */
export default function Layout(props: React.PropsWithChildren) {
  return props.children;
}
