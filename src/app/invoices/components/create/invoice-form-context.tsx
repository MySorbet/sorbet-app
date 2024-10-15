'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { ClientDetailsFormSchema } from './client-details';
import { InvoiceDetailsFormSchema } from './invoice-details';

type InvoiceFormData = Partial<
  InvoiceDetailsFormSchema & ClientDetailsFormSchema
>;

type InvoiceFormContextType = {
  formData: InvoiceFormData;
  setFormData: (data: InvoiceFormData) => void;
};

const InvoiceFormContext = createContext<InvoiceFormContextType | null>(null);
InvoiceFormContext.displayName = 'InvoiceFormContext';

export const InvoiceFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const invoiceNumber = useInvoiceNumber();
  const [formData, setFormData] = useQueryState<InvoiceFormData>({
    invoiceNumber,
  });

  return (
    <InvoiceFormContext.Provider value={{ formData, setFormData }}>
      {children}
    </InvoiceFormContext.Provider>
  );
};

/**
 * Hook to access the invoice form context
 * @returns The form context
 */
export const useInvoiceFormContext = () => {
  const context = useContext<InvoiceFormContextType | null>(InvoiceFormContext);
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
export const useQueryState = <T extends Record<string, unknown>>(
  initialState: T = {} as T
) => {
  const router = useRouter();
  const params = useSearchParams();
  const [state, setState] = useState<T>(initialState);
  const pathname = usePathname();

  // Throw the initial state into the query params
  // Triggering the below effect to set the state
  useEffect(
    () => {
      setQueryParams(initialState);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      /* Intentionally left empty to run on mount */
    ]
  );

  // Derive state from query parameters
  // TODO: Revisit special handling of items
  useEffect(() => {
    const p = Object.fromEntries(params);
    if (Object.keys(p).includes('items')) {
      setState({ ...p, items: JSON.parse(p.items) } as T);
    } else {
      setState(p as T);
    }
  }, [params]);

  const setQueryParams = (query: Partial<T>) => {
    router.push(
      `${pathname}?${new URLSearchParams({
        ...Object.fromEntries(params),
        ...Object.entries(query).reduce((acc, [key, value]) => {
          acc[key] =
            typeof value === 'object' ? JSON.stringify(value) : String(value);
          return acc;
        }, {} as Record<string, string>),
      })}`
    );
  };

  return [state, setQueryParams] as const;
};

/**
 * Gets the auto-incremented invoice number for the current user
 */
const useInvoiceNumber = () => {
  // TODO: Store the last invoice number, and auto-increment from there
  // This could be acheived by storing the invoice number in the database
  // Or by querying the number of invoices for the current user and incrementing from there
  return 'INV-001';
};
