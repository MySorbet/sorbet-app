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
  /** The current invoice form data */
  formData: InvoiceFormData;
  /** Set the client details */
  setClientDetails: (data: ClientDetailsFormSchema) => void;
  /** Set the invoice details */
  setInvoiceDetails: (data: InvoiceDetailsFormSchema) => void;
  /** Set the payment details */
  setPaymentDetails: (data: PaymentDetailsFormData) => void;
  /** Serialize the client details */
  serializeClientDetails: (data: ClientDetailsFormSchema) => string;
  /** Serialize the invoice details */
  serializeInvoiceDetails: (data: InvoiceDetailsFormSchema) => string;
  /** Serialize the payment details */
  serializePaymentDetails: (data: PaymentDetailsFormData) => string;
  /** Serialize the entire invoice form data */
  serializeFormData: (data: InvoiceFormData) => string;
};

const InvoiceFormContext = createContext<InvoiceFormContextType | null>(null);
InvoiceFormContext.displayName = 'InvoiceFormContext';

/**
 * Wrap invoice form components in this provider to access the invoice form context
 */
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
 * Use this hook to access the invoice form context
 *
 * @throws If used outside of an `InvoiceFormProvider`
 */
export const useInvoiceFormContext = () => {
  const context = useContext<InvoiceFormContextType | null>(InvoiceFormContext);
  if (!context) {
    throw new Error(
      'useInvoiceFormContext must be used within a InvoiceFormProvider'
    );
  }
  return context;
};
