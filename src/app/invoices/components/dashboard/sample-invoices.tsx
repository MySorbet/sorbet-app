import { Invoice } from './utils';

export const sampleInvoices: Invoice[] = [
  {
    invoiceNumber: 'INV001',
    status: 'paid',
    totalAmount: 250.0,
    issueDate: new Date('2024-03-15'),
    dueDate: new Date('2024-04-14'),
    memo: 'Thank you for your business',
    toName: 'Acme Corp',
    projectName: 'Website Redesign',
  },
  {
    invoiceNumber: 'INV002',
    status: 'open',
    totalAmount: 175.5,
    issueDate: new Date('2024-05-02'),
    dueDate: new Date('2024-06-01'),
    memo: 'Net 30 terms apply',
    toName: 'TechStart LLC',
    projectName: 'Mobile App Development',
  },
  {
    invoiceNumber: 'INV003',
    status: 'overdue',
    totalAmount: 420.75,
    issueDate: new Date('2024-02-20'),
    dueDate: new Date('2024-03-21'),
    memo: 'Please settle this overdue invoice',
    toName: 'Global Innovations Inc.',
  },
  {
    invoiceNumber: 'INV004',
    status: 'cancelled',
    totalAmount: 80.0,
    issueDate: new Date('2024-04-10'),
    dueDate: new Date('2024-05-10'),
    memo: 'Invoice cancelled per customer request',
    toName: 'Smith Consulting',
  },
  {
    invoiceNumber: 'INV005',
    status: 'paid',
    totalAmount: 1250.0,
    issueDate: new Date('2024-01-05'),
    dueDate: new Date('2024-02-04'),
    memo: 'Payment received with thanks',
    toName: 'Mega Industries',
  },
  {
    invoiceNumber: 'INV006',
    status: 'open',
    totalAmount: 325.25,
    issueDate: new Date('2024-05-18'),
    dueDate: new Date('2024-06-17'),
    memo: 'Please remit payment within 30 days',
    toName: 'Bright Future Solutions',
  },
  {
    invoiceNumber: 'INV007',
    status: 'overdue',
    totalAmount: 590.0,
    issueDate: new Date('2024-03-30'),
    dueDate: new Date('2024-04-29'),
    memo: 'This invoice is past due. Please pay ASAP',
    toName: 'Quantum Dynamics Ltd.',
    projectName: 'Data Analysis Service',
  },
];
