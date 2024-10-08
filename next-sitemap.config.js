/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  /** Without trailing '/' */
  // TODO: Consider making this dynamic based on the environment. Other references to window.location.origin could then use the same env var
  siteUrl: 'https://mysorbet.io',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
