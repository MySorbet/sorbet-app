/** Use navigator to copy text to the clipboard */
export const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
};
