import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BaseInProduct from '~/svg/base-in-product.svg';

export const BaseAlert = ({
  className,
  title,
  description,
  icon,
}: {
  className?: string;
  title?: string;
  description: string;
  /** Optional icon override (defaults to Base). */
  icon?: React.ReactNode;
}) => {
  return (
    <Alert className={className}>
      {icon ?? <BaseInProduct className='size-5' />}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
