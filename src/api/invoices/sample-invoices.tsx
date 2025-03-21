import { addDays, subDays } from 'date-fns';

import { Invoice } from '@/app/invoices/schema';

/**
 * Set of mock data for invoices. For use in development only.
 *
 * Notes:
 * When invoices 2.0 was implemented, we added payment methods and made projectName optional.
 * These changes are reflected here. Some invoices retain the old projectName to simulate the old data in the DB.
 */
export const sampleInvoices: Invoice[] = [
  {
    id: 'd1e2f3a4-b5c6-4d5e-9f8a-7b6c5d4e3f2a',
    userId: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    invoiceNumber: 'INV007',
    status: 'Paid',
    totalAmount: 590.0,
    issueDate: subDays(new Date(), 45),
    dueDate: subDays(new Date(), 30),
    memo: 'Payment received on time',
    fromName: 'Your Company',
    fromEmail: 'billing@yourcompany.com',
    toName: 'Quantum Dynamics Ltd.',
    toEmail: 'finance@quantumdynamics.com',
    items: [
      {
        name: 'Data Analysis Report',
        quantity: 1,
        amount: 500.0,
      },
      {
        name: 'Visualization Creation',
        quantity: 3,
        amount: 30.0,
      },
    ],
    paymentMethods: ['usdc'],
  },
  {
    id: '1a2b3c4d-5e6f-4a5b-9c8d-7e6f5a4b3c2d',
    userId: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    invoiceNumber: 'INV005',
    status: 'Paid',
    totalAmount: 1375.0,
    issueDate: subDays(new Date(), 60),
    dueDate: subDays(new Date(), 30),
    memo: 'Payment received with thanks',
    fromName: 'Your Company',
    fromEmail: 'billing@yourcompany.com',
    toName: 'Mega Industries',
    toEmail: 'invoices@megaindustries.com',
    projectName: 'AI Research Project',
    items: [
      {
        name: 'AI Algorithm Development',
        quantity: 1,
        amount: 1000.0,
      },
      {
        name: 'Technical Documentation',
        quantity: 5,
        amount: 50.0,
      },
    ],
    tax: 10,
    paymentMethods: ['usdc', 'usd'],
  },
  {
    id: 'c2d8f3a1-8f7b-4e3c-9d6a-8b7f9e2c1d3b',
    userId: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    invoiceNumber: 'INV002',
    status: 'Open',
    totalAmount: 175.5,
    issueDate: subDays(new Date(), 45),
    dueDate: subDays(new Date(), 15),
    memo: 'Net 30 terms apply',
    fromName: 'Your Company',
    fromEmail: 'billing@yourcompany.com',
    toName: 'TechStart LLC',
    toEmail: 'finance@techstart.com',
    projectName: 'Mobile App Development',
    items: [
      {
        name: 'Mobile App Development - Phase 1',
        quantity: 1,
        amount: 150.0,
      },
      {
        name: 'UI/UX Design',
        quantity: 1,
        amount: 25.5,
      },
    ],
    paymentMethods: ['usdc'],
  },
  {
    id: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    userId: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    invoiceNumber: 'INV003',
    status: 'Open',
    totalAmount: 420.75,
    issueDate: subDays(new Date(), 10),
    dueDate: addDays(new Date(), 20),
    memo: 'Please settle this overdue invoice',
    fromName: 'Your Company',
    fromEmail: 'billing@yourcompany.com',
    toName: 'Global Innovations Inc.',
    toEmail: 'payments@globalinnovations.com',
    projectName: 'AI Research Project',
    items: [
      {
        name: 'AI Research Consultation',
        quantity: 10,
        amount: 40.0,
      },
      {
        name: 'Data Processing',
        quantity: 1,
        amount: 20.75,
      },
    ],
    paymentMethods: ['usd'],
  },
  {
    id: 'f1e2d3c4-b5a6-4c5d-8e7f-9a8b7c6d5e4f',
    userId: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    invoiceNumber: 'INV004',
    status: 'Cancelled',
    totalAmount: 80.0,
    issueDate: subDays(new Date(), 5),
    dueDate: addDays(new Date(), 25),
    memo: 'Invoice cancelled per customer request',
    fromName: 'Your Company',
    fromEmail: 'billing@yourcompany.com',
    toName: 'Smith Consulting',
    toEmail: 'accounting@smithconsulting.com',
    items: [
      {
        name: 'Marketing Strategy Session',
        quantity: 2,
        amount: 40.0,
      },
    ],
    paymentMethods: ['usdc'],
  },
  {
    id: '3f7af738-5d50-4d62-9fe9-1e2c1c8b9e9a',
    userId: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    invoiceNumber: 'INV001',
    status: 'Open',
    totalAmount: 250.0,
    issueDate: new Date(),
    dueDate: addDays(new Date(), 30),
    memo: 'Thank you for your business',
    fromName: 'Your Company',
    fromEmail: 'billing@yourcompany.com',
    toName: 'Acme Corp',
    toEmail: 'accounts@acmecorp.com',
    projectName: 'Website Redesign',
    items: [
      {
        name: 'Website Redesign',
        quantity: 1,
        amount: 250.0,
      },
      {
        name: 'Domain Registration',
        quantity: 1,
        amount: 100.0,
      },
    ],
    paymentMethods: ['usdc', 'usd'],
  },
  {
    id: 'b1c2d3e4-f5a6-4b5c-8d7e-9f8a7b6c5d4e',
    userId: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d',
    invoiceNumber: 'INV006',
    status: 'Open',
    totalAmount: 325.25,
    issueDate: new Date(),
    dueDate: addDays(new Date(), 30),
    memo: 'Please remit payment within 30 days',
    fromName: 'Your Company',
    fromEmail: 'billing@yourcompany.com',
    toName: 'Bright Future Solutions',
    toEmail: 'ap@brightfuture.com',
    projectName: 'AI Research Project',
    items: [
      {
        name: 'AI Model Training',
        quantity: 1,
        amount: 250.0,
      },
      {
        name: 'Data Annotation',
        quantity: 15,
        amount: 5.0,
      },
    ],
    paymentMethods: ['usdc'],
  },
];

/** 792 character memo */
export const longestMemo =
  'Sit consectetur sunt enim. Ea consequat culpa sit nostrud exercitation. Proident occaecat incididunt commodo consequat deserunt nulla esse ad anim quis sint. Duis minim minim proident excepteur culpa nulla nostrud labore irure non incididunt sit enim. Eiusmod ipsum consectetur laborum. Id consectetur incididunt do mollit adipisicing nostrud. Tempor ad consequat deserunt magna adipisicing. Nisi dolor qui excepteur Lorem amet. Aute aliquip in ea magna consectetur laboris nostrud incididunt cupidatat ut culpa duis Lorem. Ex exercitation excepteur sint sit do et duis sunt. Fugiat laborum eu non laborum ea. Qui quis non magna qui minim ullamco velit laborum proident ad esse ipsum. Nulla eiusmod non proident cillum amet do amet exercitation est consectetur veniam. Cupidatat dolore Lorem.';
