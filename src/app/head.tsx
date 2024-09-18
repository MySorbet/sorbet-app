export default function Head() {
  const title = 'Sorbet | The All-in One Payment Experience for Freelancers';
  const description =
    'Unlock your global creative potential with Sorbet. A secure and trustworthy tool here to support you throughout your freelancing journey.';
  const imageUrl =
    'https://storage.googleapis.com/opengraph-image/og-image.png';
  return (
    <head>
      {/* LinkedIn */}
      <meta property='linkedin:title' content={title} />
      <meta property='linkedin:description' content={description} />
      <meta property='linkedin:image' content={imageUrl} />
    </head>
  );
}
