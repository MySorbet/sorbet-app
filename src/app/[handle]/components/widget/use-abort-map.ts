import { useEffect, useRef } from 'react';

/**
 * Hook to manage a map of abort controllers to the ids of the operations that they are associated with.
 * This is useful for cancelling ongoing operations when a new operation is started.
 *
 * All operations will be aborted when the component using this hook unmounts.
 * All operations will be aborted when the page is refreshed. (this is probably redundant, but it's a good precaution)
 */
export function useAbortMap() {
  const abortControllersRef = useRef<Record<string, AbortController>>({});

  /** Add a new abort controller for an operation */
  const addController = (id: string) => {
    const controller = new AbortController();
    abortControllersRef.current[id] = controller;
    return controller;
  };

  /** Get the abort controller for an operation if it exists */
  const getController = (id: string) => {
    return abortControllersRef.current[id];
  };

  /** Abort an operation if it exists. Remove the controller from the map. */
  const abortAndRemove = (id: string) => {
    const controller = abortControllersRef.current[id];
    if (controller) {
      controller.abort();
      delete abortControllersRef.current[id];
    }
  };

  /** Remove an operation's controller without aborting */
  const removeController = (id: string) => {
    delete abortControllersRef.current[id];
  };

  /** Abort all pending operations */
  const abortAll = () => {
    Object.values(abortControllersRef.current).forEach((controller) => {
      controller.abort();
    });
    abortControllersRef.current = {};
  };

  // Set up page unload handler
  useEffect(() => {
    const handleUnload = () => {
      abortAll();
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      // Also abort everything when the component using this hook unmounts
      abortAll();
    };
  }, []);

  return {
    addController,
    getController,
    abortAndRemove,
    removeController,
  };
}
