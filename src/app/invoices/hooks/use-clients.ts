import { useState } from 'react';

import { sleep } from '@/lib/utils';

import { Client } from '../v2/schema';
import { useInvoiceForm } from './use-invoice-form';

// TODO: Get clients from backend
let sampleClients: Client[] = [
  { id: '1', name: 'Acme Corp', email: 'acme@acme.com' },
  { id: '2', name: 'Wayne Enterprises', email: 'wayne@wayne.com' },
  { id: '3', name: 'Stark Industries', email: 'stark@stark.com' },
];

const updateClient = async (client: Client) => {
  // TODO: Update client in backend
  await sleep(1000);
  sampleClients = sampleClients.map((c) => (c.id === client.id ? client : c));
};

const createClient = async (client: Client) => {
  // TODO: Create client in backend
  await sleep(1000);
  sampleClients = [...sampleClients, client];
};

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const form = useInvoiceForm();
  const [isSaving, setIsSaving] = useState(false);
  const [isClientSheetOpen, setIsClientSheetOpen] = useState(false);

  // TODO: Use form state instead of local state
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(
    undefined
  );

  const handleClientChange = async (client: Client, isEditing: boolean) => {
    if (isEditing) {
      setIsSaving(true);
      await updateClient(client);
      setClients(sampleClients);
      setIsSaving(false);
    } else {
      setIsSaving(true);
      await createClient(client);
      setClients(sampleClients);
      setIsSaving(false);
    }
    setSelectedClient(client);
    setIsClientSheetOpen(false);
    form.setValue('toName', client.name);
    form.setValue('toEmail', client.email);
  };

  const handleClientSelect = (id?: string) => {
    if (id) {
      const client = sampleClients.find((client) => client.id === id);
      setSelectedClient(client);
      form.setValue('toName', client?.name ?? '');
      form.setValue('toEmail', client?.email ?? '');
    } else {
      setSelectedClient(undefined);
      form.setValue('toName', '');
      form.setValue('toEmail', '');
    }
  };

  return {
    clients,
    isClientSheetOpen,
    selectedClient,
    handleClientChange,
    handleClientSelect,
    setIsClientSheetOpen,
    setSelectedClient,
    setClients,
    isSaving,
  };
};
