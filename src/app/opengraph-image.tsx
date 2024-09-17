import { ImageResponse } from 'next/og';

export const contentType = 'image/png';

export const size = {
  height: 600,
  width: 900,
};

export const runtime = 'edge';

export default async function Image() {
  const logoSrc = await fetch(new URL('./og-image.png', import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        tw='flex w-full h-full items-center justify-center'
      >
        {/* https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#using-external-data */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore Next.js docs say to pass an array buffer to the 'src' prop */}
        <img src={logoSrc} height='100' alt='Sorbet' />
      </div>
    )
  );
}
