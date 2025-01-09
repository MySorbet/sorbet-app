import {
  ArrowRight,
  CircleCheck,
  CircleDashed,
  CircleDollarSign,
  FileText,
  Grid3X3,
  Share2,
  ShieldCheck,
  SquareUser,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

/** A Dashboard card rendering a checklist of onboarding tasks to complete */
export const ChecklistCard = ({
  onTaskClick,
  completedTasks,
  onClose,
  className,
}: {
  onTaskClick?: (task: TaskType) => void;
  completedTasks?: Record<TaskType, boolean>;
  onClose?: () => void;
  className?: string;
}) => {
  const numTasksComplete = Object.values(completedTasks ?? {}).filter(
    Boolean
  ).length;
  const progress = (numTasksComplete / totalTasks) * 100;
  const isAllTasksComplete = numTasksComplete === totalTasks;

  const title = isAllTasksComplete
    ? 'Tasks completed!'
    : 'Onboarding Checklist';
  return (
    <DashboardCard className={cn('h-fit space-y-6', className)}>
      <div className='space-y-3'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        <div className='flex items-center justify-between gap-4'>
          <Progress value={progress} className='[&>*]:bg-sorbet h-2' />
          <span className='text-muted-foreground shrink-0 text-xs'>
            {numTasksComplete} / {totalTasks}
          </span>
        </div>
      </div>
      {/* TODO: Consider a delightful animation for the transition to all tasks done */}
      {isAllTasksComplete ? (
        <Button variant='secondary' onClick={onClose} disabled={true}>
          Close
        </Button>
      ) : (
        <div className='space-y-4'>
          {tasks.map((task, index) => (
            <TaskItem
              key={index}
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
const TaskIconMap: Record<TaskType, React.ElementType> = {
  verified: ShieldCheck,
  invoice: FileText,
  profile: SquareUser,
  widget: Grid3X3,
  share: Share2,
  payment: CircleDollarSign,
};

type TaskItemProps = {
  title: string;
  completed: boolean;
  description: string;
  type: TaskType;
  onClick: () => void;
};

/**
 * Local component to display a single step in the verification process and whether it has been completed
 */
const TaskItem = ({
  title,
  completed,
  description,
  type,
  onClick,
}: TaskItemProps) => {
  const Icon = TaskIconMap[type];
  return (
    <div
      className='group flex cursor-pointer items-center justify-between gap-3'
      onClick={onClick}
    >
      <Icon
        strokeWidth={1.5}
        className='text-muted-foreground size-6 shrink-0 self-start'
      />
      <div className='mr-auto flex flex-col'>
        <div className='flex items-center'>
          <span className='text-sm font-medium'>{title}</span>
          <ArrowRight className='animate-in fade-in-0 zoom-in-0 aria-hidden size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100' />
        </div>
        <span className='text-muted-foreground text-sm font-normal'>
          {description}
        </span>
      </div>
      {completed ? (
        <CircleCheck className='text-sorbet animate-in fade-in zoom-in-0 size-6 shrink-0' />
      ) : (
        <CircleDashed className='text-muted-foreground size-6 shrink-0' />
      )}
    </div>
  );
};

/** The list of tasks to complete for onboarding */
const tasks: Omit<TaskItemProps, 'completed' | 'onClick'>[] = [
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
