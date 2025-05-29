import { RecipientAPI } from '@/api/recipients/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { SendToForm } from './send-to-form';

/**
 * Card rendering the send to form.
 */
export const SendToCard = ({
  className,
  recipients,
  onAdd,
  onSend,
  maxAmount,
}: {
  className?: string;
  recipients?: RecipientAPI[];
  onAdd?: () => void;
  onSend?: (amount: number, address: string) => void;
  maxAmount?: number;
}) => {
  return (
    <Card className={cn('min-w-64 max-w-lg p-6', className)}>
      <SendToForm
        recipients={recipients}
        onSend={onSend}
        maxAmount={maxAmount}
        onAdd={onAdd}
      />
    </Card>
  );
};
