type OpenPollAndCallbackOptions = {
  link: string /** The link to open in a new tab */;
  interval?: number /** The interval on which to check if the window is closed */;
  onClose?: () => void /** The callback to run when the window is closed */;
};

export const openPollAndCallback = ({
  link,
  interval = 1000,
  onClose,
}: OpenPollAndCallbackOptions) => {
  const newWindow = window.open(link, '_blank');
  const checkWindow = setInterval(() => {
    if (newWindow?.closed) {
      clearInterval(checkWindow);
      console.log('New window closed');
      onClose?.();
    }
  }, interval);
};
