import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BaseInProduct from '~/svg/base-in-product.svg';

export const BaseAlert = ({
  className,
  title,
  description,
}: {
  className?: string;
  title?: string;
  description: string;
}) => {
  return (
    <Alert className={className}>
      <BaseInProduct className='size-5' />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
