import { Document, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { createTw } from 'react-pdf-tailwind';

// Import your tailwind config
import tailwindConfig from '../../../tailwind.config';

// Create a 'tw' function using your tailwind config
const tw = createTw({
  ...tailwindConfig,
  theme: {
    ...tailwindConfig.theme,
    fontFamily: {
      sans: 'Helvetica',
    },
  },
});

// Define props interface
interface InvoicePDFProps {
  from: { name: string; email: string };
  to: { name: string; email: string };
  details: { project: string; invoiceNumber: string };
  items: Array<{ description: string; quantity: number; amount: number }>;
  total: number;
  terms: { issued: string; due: string; payment: string };
}

const Heading = ({ children }: { children: React.ReactNode }) => (
  <Text style={tw('font-bold mb-2 text-sm')}>{children}</Text>
);

export const InvoicePDF: React.FC<InvoicePDFProps> = ({
  from,
  to,
  details,
  items,
  total,
  terms,
}) => (
  <Document>
    <Page size='A4' style={tw('p-10 font-sans')}>
      <Text style={tw('text-4xl font-bold mb-8')}>Invoice</Text>

      <View style={tw('flex flex-row justify-between mb-8')}>
        <View style={tw('flex-1')}>
          <Heading>From</Heading>
          <Text style={tw('text-sm')}>{from.name}</Text>
          <Text style={tw('text-sm')}>{from.email}</Text>
        </View>
        <View style={tw('flex-1')}>
          <Heading>To</Heading>
          <Text style={tw('text-sm')}>{to.name}</Text>
          <Text style={tw('text-sm')}>{to.email}</Text>
        </View>
        <View style={tw('flex-1')}>
          <Heading>Details</Heading>
          <Text style={tw('text-sm')}>{details.project}</Text>
          <Text style={tw('text-sm')}>{details.invoiceNumber}</Text>
        </View>
      </View>

      <View style={tw('mb-8')}>
        <View style={tw('flex flex-row bg-gray-100 py-2')}>
          <Text style={tw('flex-1 font-bold text-sm')}>Item</Text>
          <Text style={tw('w-20 font-bold text-sm text-right')}>Quantity</Text>
          <Text style={tw('w-24 font-bold text-sm text-right')}>Amount</Text>
        </View>
        {items.map((item, index) => (
          <View
            key={index}
            style={tw('flex flex-row py-2 border-b border-gray-200')}
          >
            <Text style={tw('flex-1 text-sm')}>{item.description}</Text>
            <Text style={tw('w-20 text-sm text-right')}>{item.quantity}</Text>
            <Text style={tw('w-24 text-sm text-right')}>
              ${item.amount.toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={tw('flex flex-row py-2 border-t border-gray-200')}>
          <Text style={tw('flex-1 font-bold text-sm')}>Total</Text>
          <Text style={tw('w-24 font-bold text-sm text-right')}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={tw('flex flex-row')}>
        <View style={tw('flex-1')}>
          <Heading>Terms</Heading>
          <Text style={tw('text-sm')}>Issued: {terms.issued}</Text>
          <Text style={tw('text-sm')}>Due: {terms.due}</Text>
          <Text style={tw('text-sm')}>Payment: {terms.payment}</Text>
        </View>
        <View style={tw('flex-1')}>
          <Heading>Memo</Heading>
          {/* Add memo content if needed */}
        </View>
      </View>
    </Page>
  </Document>
);
