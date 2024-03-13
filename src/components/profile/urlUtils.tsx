/* eslint-disable no-useless-escape */
export function validateUrl(url: string, selectedTag: string) {
  let regex: RegExp;

  switch (selectedTag) {
    case 'youtube':
      regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      break;
    case 'spotify':
      regex =
        /^(https?:\/\/)?(www\.)?(open\.spotify\.com\/(user\/[a-zA-Z0-9]+\/)?(playlist|track|album|show|episode)\/[a-zA-Z0-9]+).*$/;
      break;
    case 'github':
      regex = /^(https?:\/\/)?(www\.)?(github\.com\/[a-zA-Z0-9-_]+)\/?$/;
      break;
    case 'dribbble':
      regex = /^https?:\/\/dribbble\.com\/shots\/\d+-[^\/]+$/;
      break;
    case 'soundcloud':
      regex = /^https?:\/\/(www\.)?soundcloud\.com\/[^\/]+\/[^\/]+$/;
      break;
    case 'instgram':
      regex = /^https?:\/\/(www\.)?instgram\.com\/[^\/]+\/[^\/]+$/;
      break;
    default:
      throw new Error(`Invalid tag: ${selectedTag}`);
  }

  return regex.test(url);
}
