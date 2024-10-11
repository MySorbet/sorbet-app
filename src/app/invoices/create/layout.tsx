'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

import Authenticated from '@/app/authenticated';
import { Header } from '@/components/header';

type InvoiceFormContextType = {
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
};

const InvoiceFormContext = createContext<InvoiceFormContextType | null>(null);

// TODO: each route should prefetch the next one

export default function CreateInvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useQueryState({});

  return (
    <Authenticated>
      <Header />
      <InvoiceFormContext.Provider value={{ formData, setFormData }}>
        {children}
      </InvoiceFormContext.Provider>
    </Authenticated>
  );
}

/**
 * Hook to access the invoice form context
 * @returns The form context
 */
export const useInvoiceFormContext = () => {
  const context = useContext(InvoiceFormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormContextProvider');
  }
  return context;
};

/**
 * Custom hook to derive state from query parameters in the URL
 * @param initialState - Initial state for the query parameters
 * @returns A tuple containing the current state and a function to set the query parameters
 */
export const useQueryState = (initialState = {}) => {
  const router = useRouter();
  const params = useSearchParams();
  const [state, setState] = useState(initialState);
  const pathname = usePathname();

  // Derive state from query parameters
  // TODO: Revisit special handling ot items
  useEffect(() => {
    const p = Object.fromEntries(params);
    if (Object.keys(p).includes('items')) {
      setState({ ...p, items: JSON.parse(p.items) });
    } else {
      setState(p);
    }
  }, [params]);

  const setQueryParams = (query: Record<string, string>) => {
    router.push(
      `${pathname}?${new URLSearchParams({
        ...Object.fromEntries(params),
        ...query,
      })}`
    );
  };

  return [state, setQueryParams] as const;
};
