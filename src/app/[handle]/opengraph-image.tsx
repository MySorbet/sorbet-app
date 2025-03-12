import { ImageResponse } from 'next/og';

import { env } from '@/lib/env';
import { formatName } from '@/lib/utils';

const API_URL = env.NEXT_PUBLIC_SORBET_API_URL;

// TODO: How to customize the alt text to be their handle?
export const alt = 'Freelancer';

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

  // TODO: Self host inter and use it here. This should fix the fontWeights not being right
  const name = formatName(user.firstName, user.lastName) ?? user.handle;

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
          {/* TODO: could we read the sorbet logo from file rather than duplicating it here? */}
          <svg
            width='35'
            height='36'
            viewBox='0 0 35 36'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect
              y='0.913086'
              width='34.1747'
              height='34.1747'
              rx='17.0873'
              fill='#6230EC'
            />
            <path
              d='M15.7476 8.79731C15.7476 8.57983 15.5543 8.41228 15.3411 8.45506C12.3039 9.06438 10.0348 11.4873 10.0348 14.3835C10.0348 17.2796 12.3039 19.7026 15.3411 20.3119C15.5543 20.3547 15.7476 20.1871 15.7476 19.9696L15.7476 8.79731Z'
              fill='#D3EC30'
            />
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M21.1325 8.38529C21.1478 8.38505 21.1632 8.38492 21.1787 8.38492C22.7562 8.38492 24.035 9.66376 24.035 11.2413C24.035 12.8188 22.7562 14.0977 21.1787 14.0977C19.9798 14.0977 18.9534 13.359 18.5297 12.312C18.1556 11.8719 17.8446 11.6934 17.1831 11.4768C16.9617 11.4043 16.7419 11.3129 16.6945 11.2737C16.6472 11.2346 16.6085 11.1941 16.6085 11.1838C16.6085 11.0495 16.7638 10.9458 17.166 10.8116C17.8813 10.573 18.276 10.3229 18.5824 9.91409C18.7254 9.72337 18.8551 9.56071 18.978 9.42019C19.0644 9.31587 19.1581 9.2178 19.2583 9.12675C19.4754 8.92208 19.6859 8.77861 19.9316 8.65748C20.3221 8.46494 20.7315 8.3791 21.1325 8.38529Z'
              fill='#D3EC30'
            />
            <path
              d='M18.3221 27.2056C18.3221 27.4231 18.5154 27.5906 18.7286 27.5479C21.7658 26.9386 24.0349 24.5156 24.0349 21.6195C24.0349 18.7233 21.7658 16.3004 18.7286 15.6911C18.5154 15.6483 18.3221 15.8158 18.3221 16.0333L18.3221 27.2056Z'
              fill='#D3EC30'
            />
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M12.9365 27.6177C12.9214 27.6179 12.9063 27.618 12.8912 27.618C11.3136 27.618 10.0348 26.3392 10.0348 24.7616C10.0348 23.1841 11.3136 21.9053 12.8912 21.9053C14.0901 21.9053 15.1165 22.6439 15.5401 23.691C15.9142 24.1311 16.2253 24.3096 16.8868 24.5262C17.1081 24.5986 17.328 24.69 17.3753 24.7292C17.4226 24.7684 17.4614 24.8089 17.4614 24.8191C17.4614 24.9535 17.306 25.0572 16.9038 25.1914C16.1886 25.43 15.7939 25.6801 15.4874 26.0889C15.3441 26.28 15.2141 26.443 15.091 26.5838C15.0052 26.6872 14.9123 26.7845 14.8129 26.8749C14.5954 27.0802 14.3845 27.2241 14.1383 27.3455C13.7475 27.5382 13.3377 27.624 12.9365 27.6177Z'
              fill='#D3EC30'
            />
          </svg>
          <span
            style={{
              color: '#6230EC',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.025,
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
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.firstName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '100%',
              }}
            />
          ) : (
            // TODO: Use the default avatar at avatar-fallback.svg instead
            <div
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '100%',
                backgroundColor: '#e5e7eb',
                display: 'flex',
              }}
            />
          )}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 60,
              fontWeight: 700,
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
    }
  );
}
