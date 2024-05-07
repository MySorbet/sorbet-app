export default function Head() {
  const title = 'Sorbet | Ultimate Tool for Creative Freelancers';
  const description =
    'The all-in-one solution for your freelance work, powered by blockchain.';
  const imageUrl =
    'http://framerusercontent.com/images/oIBwaUw8Is43oxKK9ekodxxA.png';

  return (
    <head>
      <title>{title}</title>
      <meta content='width=device-width, initial-scale=1' name='viewport' />

      <meta name='description' content={description} />
      <meta
        name='keywords'
        content='social network, NEAR blockchain, collaboration, creators, ai'
      />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={imageUrl} />
      <meta property='og:image:alt' content={description} />

      {/* Twitter */}
      <meta property='twitter:card' content='summary_large_image' />
      <meta property='twitter:title' content={title} />
      <meta property='twitter:description' content={description} />
      <meta property='twitter:image' content={imageUrl} />

      {/* LinkedIn */}
      <meta property='linkedin:title' content={title} />
      <meta property='linkedin:description' content={description} />
      <meta property='linkedin:image' content={imageUrl} />

      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='192x192'
        href='/android-chrome-192x192.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='512x512'
        href='/android-chrome-512x512.png'
      />
      <link rel='manifest' href='/site.webmanifest' />
      <link rel='icon' href='/favicon.ico' />
      <meta name='theme-color' content='#ffffff' />
    </head>
  );
}
