import { useRef, useState } from 'react';

/**
 * Manage the open state of the invoice sheet and optionally the cancel drawer
 */
export const useIsInvoiceSheetOpen = () => {
  const [isInvoiceSheetOpen, _setIsInvoiceSheetOpen] = useState(false);
  const [forceOpenCancelDrawer, _setForceOpenCancelDrawer] = useState(false);

  const confirmCancelRefTimeout = useRef<NodeJS.Timeout>();
  const onCloseRefTimeout = useRef<NodeJS.Timeout>();

  // Return a function to set the forceOpenCancelDrawer state
  // Timeouts effecting forceOpenCancelDrawer are cleared first
  const setForceOpenCancelDrawer = (open: boolean) => {
    clearTimeout(confirmCancelRefTimeout.current);
    _setForceOpenCancelDrawer(open);
  };

  // Return a function to set the isInvoiceSheetOpen state
  // Optionally force the cancel drawer open or closed
  // Optionally call a callback when the invoice sheet is closed
  // Timeouts effecting isInvoiceSheetOpen and forceOpenCancelDrawer are cleared first
  const setIsInvoiceSheetOpen = (
    open: boolean,
    forceOpenCancelDrawer?: boolean,
    onClose?: () => void
  ) => {
    clearTimeout(onCloseRefTimeout.current);
    clearTimeout(confirmCancelRefTimeout.current);

    _setIsInvoiceSheetOpen(open);

    // If the cancel drawer was forced open, set a timeout to force it open
    // So that it opens after the sheet opens
    // old timeout was cleared above
    if (forceOpenCancelDrawer) {
      confirmCancelRefTimeout.current = setTimeout(() => {
        _setForceOpenCancelDrawer(true);
      }, 300);
    }

    // If the sheet is closing, close the cancel drawer immediately
    // And call the onClose callback after the sheet is closed
    if (!open) {
      _setForceOpenCancelDrawer(false);
      onCloseRefTimeout.current = setTimeout(() => {
        onClose?.();
      }, 300);
    }
  };

  return {
    isInvoiceSheetOpen,
    setIsInvoiceSheetOpen,
    forceOpenCancelDrawer,
    setForceOpenCancelDrawer,
  };
};
