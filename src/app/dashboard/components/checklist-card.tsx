import {
  CircleDollarSign,
  FileText,
  Grid3X3,
  LucideIcon,
  Share2,
  ShieldCheck,
  SquareUser,
} from 'lucide-react';

import {
  TaskItem,
  TaskItemProps,
} from '@/components/common/task-item/task-item';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { DashboardCard } from './dashboard-card';

const TaskTypes = [
  'verified',
  'invoice',
  'profile',
  'widget',
  'share',
  'payment',
] as const;
export type TaskType = (typeof TaskTypes)[number];
const totalTasks = TaskTypes.length;

/** Tasks status are reported as an object mapping every task type to a boolean */
export type TaskStatuses = Record<TaskType, boolean>;

/** Helper to check if tasks are complete outside of the component */
export const checkTasksComplete = (completedTasks: TaskStatuses): boolean => {
  return Object.values(completedTasks).every(Boolean);
};

/** A Dashboard card rendering a checklist of onboarding tasks to complete */
export const ChecklistCard = ({
  onTaskClick,
  completedTasks,
  onClose,
  className,
  loading,
}: {
  onTaskClick?: (task: TaskType) => void;
  completedTasks?: TaskStatuses;
  onClose?: () => void;
  className?: string;
  loading?: boolean;
}) => {
  const numTasksComplete = Object.values(completedTasks ?? {}).filter(
    Boolean
  ).length;
  const progress = (numTasksComplete / totalTasks) * 100;

  // Note that we do not use the checkTasksComplete helper here because
  // We need to know how many tasks are complete to display the progress
  const isAllTasksComplete = numTasksComplete === totalTasks;

  const title = isAllTasksComplete
    ? 'Tasks completed!'
    : 'Onboarding Checklist';

  return (
    <DashboardCard className={cn('@container h-fit space-y-6', className)}>
      <div className='space-y-3'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <div className='flex items-center justify-between gap-4'>
          <Progress
            value={progress}
            className={cn('[&>*]:bg-sorbet h-2', loading && 'animate-pulse')}
          />
          {loading ? (
            <Skeleton className='h-4 w-6' />
          ) : (
            <span className='text-muted-foreground shrink-0 text-xs'>
              {numTasksComplete} / {totalTasks}
            </span>
          )}
        </div>
      </div>
      {/* TODO: Consider a delightful animation for the transition to all tasks done */}
      {isAllTasksComplete ? (
        <Button
          variant='secondary'
          onClick={onClose}
          className='@xs:max-w-36 w-full'
        >
          Close
        </Button>
      ) : (
        <div className='space-y-4'>
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
  profile: SquareUser,
  widget: Grid3X3,
  share: Share2,
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
    description: 'Complete KYC verification to accept ACH/Wire payments',
    type: 'verified',
  },
  {
    title: 'Create an invoice',
    description: 'Create your first invoice in minutes',
    type: 'invoice',
  },
  {
    title: 'Edit profile',
    description: 'Add your avatar, name, bio, and skills',
    type: 'profile',
  },
  {
    title: 'Add a widget',
    description: 'Start creating your profile by adding widgets',
    type: 'widget',
  },
  {
    title: 'Share your profile',
    description: 'Get noticed by sharing your profile with your community',
    type: 'share',
  },
  {
    title: 'Receive payment',
    description: 'Receive your first payment into your Sorbet wallet',
    type: 'payment',
  },
];
