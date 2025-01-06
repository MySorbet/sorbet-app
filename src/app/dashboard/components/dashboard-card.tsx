import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/** Common card styles for all dashboard cards. Compose with other components to create a specific dashboard card. */
export const DashboardCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <Card className={cn('p-6', className)}>{children}</Card>;
};
