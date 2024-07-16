/**
 * Check if a given url is valid
 *
 * @param url The url to check for validity
 * @returns whether the url is valid or not
 * @throws if the hostname is not supported
 */
export function validateUrl(url: string) {
  let regex: RegExp;
  const hostname = new URL(url).hostname;

  if (hostname.includes('youtu.be') || hostname.includes('youtube.com')) {
    regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  } else if (hostname.includes('spotify.com')) {
    regex =
      /^(https?:\/\/)?(www\.)?(open\.spotify\.com\/(user\/[a-zA-Z0-9]+\/)?(playlist|track|album|show|episode)\/[a-zA-Z0-9]+).*$/;
  } else if (hostname.includes('github.com')) {
    regex = /^(https?:\/\/)?(www\.)?(github\.com\/[a-zA-Z0-9-_]+)\/?$/;
  } else if (hostname.includes('dribbble.com')) {
    regex = /^https?:\/\/dribbble\.com\/shots\/\d+-[^\/]+$/;
  } else if (hostname.includes('soundcloud.com')) {
    regex = /^https?:\/\/(www\.)?soundcloud\.com\/[^\/]+\/[^\/]+$/;
  } else if (hostname.includes('instagram.com')) {
    regex =
      /^(https?:\/\/)?(www\.)?instagram\.com\/(p\/[a-zA-Z0-9-_]+\/?|[^\/]+\/?)$/;
  } else if (hostname.includes('substack.com')) {
    regex = /^https?:\/\/([a-zA-Z0-9]+\.substack\.com\/).*$/;
  } else if (hostname.includes('behance.net')) {
    regex = /^https?:\/\/(www\.)?behance\.net\/gallery\/[a-zA-Z0-9]+\/[^\/]+$/;
  } else if (hostname.includes('medium.com')) {
    regex =
      /^https?:\/\/(www\.)?medium\.com\/@?[a-zA-Z0-9-]+(\/[a-zA-Z0-9-]+)?$/;
  } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    regex = /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/?$/;
  } else {
    throw new Error(`Invalid hostname: ${hostname}`);
  }

  return regex.test(url);
}
