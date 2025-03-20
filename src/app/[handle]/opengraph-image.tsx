import { ImageResponse } from 'next/og';
import type { ImageResponseOptions } from 'next/server';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { env } from '@/lib/env';
import { formatName } from '@/lib/utils';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

// TODO: How to customize the alt text to be their handle?
export const alt = 'Sorbet Profile';

// Standard size for opengraph images
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Note we do not use experimental tw style here because it is buggy (aspect-square and size-full sometimes cause this route to fail)
export default async function Image({
  params,
}: {
  params: { handle: string };
}) {
  // Note: Apparently we can't use axios for getUserByHandle?
  const user = await fetch(`${API_URL}/users/handle/${params.handle}`, {
    cache: 'no-store', // No store because we need to get the latest user
  }).then((res) => res.json());

  const name = formatName(user.firstName, user.lastName) ?? user.handle;

  const avatarFallbackSrc = await createSVGBase64(
    'public/svg/avatar-fallback.svg'
  );
  const logoSrc = await createSVGBase64('public/svg/logo.svg');

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 40,
            height: 40,
            width: 40,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <img src={logoSrc} alt='Sorbet Logo' />
          <span
            style={{
              color: '#6230EC',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            SORBET
          </span>
        </div>
        <span
          style={{
            position: 'relative',
            display: 'flex',
            width: 208,
            height: 208,
            flexShrink: 0,
            overflow: 'hidden',
            borderRadius: '100%',
          }}
        >
          <img
            src={user.profileImage || avatarFallbackSrc}
            alt={user.firstName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '100%',
            }}
          />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 60,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {name}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: await getLocalFonts(),
    }
  );
}

/**
 * Read an svg from the project (relative to the project root) and return a base64 encoded string (to pass to an image tag)
 * - loosely based on https://github.com/vercel/satori/issues/311#issuecomment-2294864621
 */
const createSVGBase64 = async (url: string) => {
  const buffer = Buffer.from(await readFile(join(process.cwd(), url)));
  return `data:${'image/svg+xml'};base64,${buffer.toString('base64')}`;
};

/**
 * We would like to use Inter for the opengraph image.
 * - Loading to from google fonts is slow
 * - We could self host the variable font and use that here, but variable fonts seem not to work in satori yet
 * - So we just host a 600 weight static font specifically for this og image
 *
 * Reference
 * - https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx
 * - https://github.com/vercel/next.js/discussions/49860
 * - https://github.com/vercel/next.js/issues/48081
 */
export async function getLocalFonts(): Promise<ImageResponseOptions['fonts']> {
  const fontData = await readFile(
    join(process.cwd(), 'public/fonts/Inter_18pt-SemiBold.ttf')
  );
  const fontSrc = Uint8Array.from(fontData).buffer;

  return [
    {
      name: `Inter`,
      data: fontSrc,
      style: 'normal',
      weight: 600,
    },
  ];
}
