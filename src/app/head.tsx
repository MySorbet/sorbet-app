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

      <link rel='icon' href='/favicon.ico' />
    </head>
  );
}
