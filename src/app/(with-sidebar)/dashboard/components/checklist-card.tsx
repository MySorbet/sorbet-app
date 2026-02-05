import {
  ChevronDown,
  CircleDollarSign,
  FileText,
  LucideIcon,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

import {
  TaskItem,
  TaskItemProps,
} from '@/components/common/task-item/task-item';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { DashboardCard } from './dashboard-card';

const TaskTypes = ['verified', 'invoice', 'payment'] as const;
export type TaskType = (typeof TaskTypes)[number];
const totalTasks = TaskTypes.length;

/** Tasks status are reported as an object mapping every task type to a boolean */
export type TaskStatuses = Record<TaskType, boolean>;

/** Helper to check if tasks are complete outside of the component */
export const checkTasksComplete = (completedTasks: TaskStatuses): boolean => {
  return TaskTypes.every((task) => completedTasks?.[task]);
};

/** A Dashboard card rendering a collapsible checklist of onboarding tasks to complete */
export const ChecklistCard = ({
  onTaskClick,
  completedTasks,
  className,
  loading,
}: {
  onTaskClick?: (task: TaskType) => void;
  completedTasks?: TaskStatuses;
  className?: string;
  loading?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const numTasksComplete = TaskTypes.reduce(
    (count, task) => count + (completedTasks?.[task] ? 1 : 0),
    0
  );
  const progress = (numTasksComplete / totalTasks) * 100;

  return (
    <DashboardCard
      className={cn('@container h-fit min-w-0 space-y-4', className)}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex w-full items-center justify-between gap-4'
        aria-expanded={isExpanded}
        aria-label='Toggle onboarding checklist'
      >
        <h2 className='truncate text-lg font-semibold sm:text-xl'>
          Onboarding checklist
        </h2>
        <div className='flex shrink-0 items-center gap-2 sm:gap-3'>
          {loading ? (
            <Skeleton className='h-4 w-8' />
          ) : (
            <span className='text-muted-foreground text-xs sm:text-sm'>
              {numTasksComplete}/{totalTasks}
            </span>
          )}
          <ChevronDown
            className={cn(
              'text-muted-foreground size-5 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        </div>
      </button>

      <Progress
        value={progress}
        className={cn('[&>*]:bg-sorbet h-2', loading && 'animate-pulse')}
      />

      {isExpanded && (
        <div className='animate-in fade-in slide-in-from-top-2 space-y-3 duration-200 sm:space-y-4'>
          {tasks.map((task, index) => (
            <DashboardTaskItem
              key={index}
              loading={loading}
              {...task}
              completed={completedTasks?.[task.type] ?? false}
              onClick={() => onTaskClick?.(task.type)}
            />
          ))}
        </div>
      )}
    </DashboardCard>
  );
};

/** Map task types to their icon for rendering */
const TaskIconMap: Record<TaskType, LucideIcon> = {
  verified: ShieldCheck,
  invoice: FileText,
  payment: CircleDollarSign,
};

type DashboardTaskItemProps = Omit<TaskItemProps, 'Icon'> & {
  type: TaskType;
};

/**
 * Local component to display a single step in the verification process and whether it has been completed
 */
const DashboardTaskItem = (props: DashboardTaskItemProps) => {
  const Icon = TaskIconMap[props.type];
  return <TaskItem {...props} Icon={Icon} />;
};

/** The list of tasks to complete for onboarding */
const tasks: Omit<DashboardTaskItemProps, 'completed' | 'onClick'>[] = [
  {
    title: 'Get verified',
    description: 'Add your details to accept ACH/Wire payments',
    type: 'verified',
  },
  {
    title: 'Create an invoice',
    description: 'Create your first invoice in minutes',
    type: 'invoice',
  },
  {
    title: 'Receive payment',
    description: 'Receive your first payment into your Sorbet wallet',
    type: 'payment',
  },
];
