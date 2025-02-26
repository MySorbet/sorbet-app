import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

/** Noop layout. We just use this file to set metadata */
export default function CreateInvoiceLayout(props: React.PropsWithChildren) {
  return props.children;
}
