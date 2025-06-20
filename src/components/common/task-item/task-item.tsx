import { ArrowRight } from 'lucide-react';
import { CircleCheck, CircleDashed } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type TaskItemProps = {
  /** The title of the task */
  title: React.ReactNode;
  /** Whether the task has been completed */
  completed: boolean;
  /** The description of the task */
  description: string;
  /** The Lucide icon component to display */
  Icon: LucideIcon;
  /** The callback to execute when the task is clicked */
  onClick?: () => void;
  /** Whether the task is loading */
  loading?: boolean;
  /** Whether the task is disabled */
  disabled?: boolean;
};

/**
 * A clickable item representing a task to complete. May render a completed or loading state.
 */
export const TaskItem = ({
  title,
  completed,
  description,
  loading,
  onClick,
  Icon,
  disabled,
}: TaskItemProps) => {
  return (
    <div
      className={cn(
        'group flex cursor-pointer items-center justify-between gap-4',
        disabled && 'pointer-events-none'
      )}
      onClick={disabled ? undefined : onClick}
      role='button'
    >
      <Icon
        strokeWidth={1.5}
        className='text-muted-foreground size-6 shrink-0 self-start'
      />
      <div className='mr-auto flex flex-col'>
        <div className='flex items-center'>
          <span className='text-sm font-medium'>{title}</span>
          <ArrowRight className='animate-in fade-in-0 zoom-in-0 aria-hidden size-4 shrink-0 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100' />
        </div>
        <span className='text-muted-foreground text-sm font-normal'>
          {description}
        </span>
      </div>
      {loading ? (
        <Skeleton className='size-6 shrink-0 rounded-full' />
      ) : completed ? (
        <CircleCheck className='text-sorbet animate-in fade-in zoom-in-0 size-6 shrink-0' />
      ) : (
        <CircleDashed className='text-muted-foreground size-6 shrink-0' />
      )}
    </div>
  );
};
