import { useState } from 'react';

/** Hook to track pending widget operations */
export function usePendingWidgets() {
  const [pendingWidgets, setPendingWidgets] = useState(new Set<string>());

  const addPending = (id: string) => {
    setPendingWidgets((prev) => new Set(prev).add(id));
  };

  const removePending = (id: string) => {
    setPendingWidgets((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const isPending = (id: string) => pendingWidgets.has(id);

  return {
    addPending,
    removePending,
    isPending,
  };
}
