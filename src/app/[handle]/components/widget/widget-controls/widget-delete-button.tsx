import { CompactDeleteButton } from '@/components/common/compact-delete-button';
import { cn } from '@/lib/utils';

// TODO: The hover ring isn't quite right for this button either.
// TODO: Note that rather than putting in time to resize the delete icon from 20 to 16, I just made this button bigger. Revisit this.

/**
 * A delete button for a widget.
 * - Just styles the `CompactDeleteButton` in a black circle to match design.
 */
export const WidgetDeleteButton = ({
  onDelete,
  className,
}: {
  onDelete: () => void;
  className?: string;
}) => {
  return (
    <CompactDeleteButton
      onDelete={onDelete}
      className={cn(
        'rounded-full bg-[#18181B] p-[0.125rem] text-white shadow-lg',
        className
      )}
    />
  );
};
