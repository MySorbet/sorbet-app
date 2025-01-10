import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/** Common card styles for all dashboard cards. Compose with other components to create a specific dashboard card. */
export const DashboardCard = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Card
      className={cn('p-6', className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </Card>
  );
};
