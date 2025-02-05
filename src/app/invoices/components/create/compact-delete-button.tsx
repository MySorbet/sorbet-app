import { DeleteIcon } from '@/components/ui/delete';
import { cn } from '@/lib/utils';

/**
 * Compact delete button. Has some padding to make it easier to click.
 * Has a delightful animated hover, but does not highlight on focus,
 * so you can use negative margin to pull it closer to elements.
 */
export const CompactDeleteButton = ({
  onDelete,
  className,
}: {
  onDelete?: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onDelete}
      className={cn(
        'ring-offset-background focus-visible:ring-ring rounded-lg outline-none focus-visible:ring-2',
        className
      )}
      type='button'
    >
      <span className='sr-only'>Delete</span>
      <DeleteIcon
        aria-hidden='true'
        className={cn(
          'h-fit p-2 hover:text-red-500',
          '[&>svg]:size-5 [&>svg]:shrink-0 [&>svg]:stroke-current [&>svg]:stroke-[1.5]'
        )}
      />
    </button>
  );
};
