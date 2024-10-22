'use client';

import {
  createSerializer,
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsJson,
  parseAsString,
  useQueryStates,
} from 'nuqs';
import React, { createContext, useContext } from 'react';

import { ClientDetailsFormSchema } from './client-details';
import { InvoiceDetailsFormSchema, InvoiceItemData } from './invoice-details';
import { PaymentDetailsFormData } from './payment-details';

type WithNull<T> = {
  [P in keyof T]: T[P] | null;
};

// TODO: Address null vs Partial b/c other components want to use undefined
export type InvoiceFormData = WithNull<
  InvoiceDetailsFormSchema & ClientDetailsFormSchema & PaymentDetailsFormData
>;

type InvoiceFormContextType = {
  formData: InvoiceFormData;
  setClientDetails: (data: ClientDetailsFormSchema) => void;
  setInvoiceDetails: (data: InvoiceDetailsFormSchema) => void;
  setPaymentDetails: (data: PaymentDetailsFormData) => void;
  serializeClientDetails: (data: ClientDetailsFormSchema) => string;
  serializeInvoiceDetails: (data: InvoiceDetailsFormSchema) => string;
  serializePaymentDetails: (data: PaymentDetailsFormData) => string;
  serializeFormData: (data: InvoiceFormData) => string;
};

const InvoiceFormContext = createContext<InvoiceFormContextType | null>(null);
InvoiceFormContext.displayName = 'InvoiceFormContext';

export const InvoiceFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Client Details
  const clientDetailsQueryState = {
    fromName: parseAsString,
    fromEmail: parseAsString,
    toName: parseAsString,
    toEmail: parseAsString,
  };
  const [clientDetails, setClientDetails] = useQueryStates(
    clientDetailsQueryState
  );
  const serializeClientDetails = createSerializer(clientDetailsQueryState);

  // Invoice details
  const invoiceDetailsQueryState = {
    projectName: parseAsString,
    invoiceNumber: parseAsString,
    items: parseAsArrayOf<InvoiceItemData>(parseAsJson()),
  };
  const serializeInvoiceDetails = createSerializer(invoiceDetailsQueryState);
  const [invoiceDetails, setInvoiceDetails] = useQueryStates(
    invoiceDetailsQueryState
  );

  // Payment details
  const paymentDetailsQueryState = {
    issueDate: parseAsIsoDateTime,
    dueDate: parseAsIsoDateTime,
    memo: parseAsString,
  };
  const [paymentDetails, setPaymentDetails] = useQueryStates(
    paymentDetailsQueryState
  );
  const serializePaymentDetails = createSerializer(paymentDetailsQueryState);

  const serializeFormData = createSerializer({
    ...clientDetailsQueryState,
    ...invoiceDetailsQueryState,
    ...paymentDetailsQueryState,
  });

  const formData = {
    ...clientDetails,
    ...invoiceDetails,
    ...paymentDetails,
  };

  return (
    <InvoiceFormContext.Provider
      value={{
        formData,
        setClientDetails,
        setInvoiceDetails,
        setPaymentDetails,
        serializeClientDetails,
        serializeInvoiceDetails,
        serializePaymentDetails,
        serializeFormData,
      }}
    >
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
