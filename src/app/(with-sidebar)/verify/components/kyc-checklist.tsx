import { FileText, LucideIcon, ShieldCheck } from 'lucide-react';

import { UploadProofOfAddressStep } from '@/app/(with-sidebar)/verify/components/upload-proof-of-address-step';
import {
  TaskItem,
  TaskItemProps,
} from '@/components/common/task-item/task-item';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { VerifyCard } from './verify-card';

export const VerifySteps = ['terms', 'details'] as const;
export type VerifyStep = (typeof VerifySteps)[number];

type TaskType = VerifyStep;
const totalSteps = VerifySteps.length;

/** Steps status are reported as an object mapping every step type to a boolean */
type TaskStatuses = Record<TaskType, boolean>;

/** Helper to check if steps are complete outside of the component */
export const checkStepsComplete = (completedSteps: TaskStatuses): boolean => {
  return Object.values(completedSteps).every(Boolean);
};

/** A verification card rendering a checklist of KYC steps to complete */
export const KYCChecklist = ({
  onTaskClick,
  completedTasks: completedTasks,
  className,
  loading,
  indeterminate,
}: {
  onTaskClick?: (task: TaskType) => void;
  completedTasks?: TaskStatuses;
  className?: string;
  loading?: boolean;
  indeterminate?: boolean;
}) => {
  const numTasksComplete = Object.values(completedTasks ?? {}).filter(
    Boolean
  ).length;
  const progress = (numTasksComplete / totalSteps) * 100;

  return (
    <VerifyCard className={cn('min-w-72 space-y-6', className)}>
      <div className='space-y-3'>
        <h2 className='text-2xl font-semibold'>KYC verification</h2>
        <div className='flex items-center justify-between gap-4'>
          <Progress
            value={progress}
            indeterminate={indeterminate}
            className={cn('[&>*]:bg-sorbet h-2', loading && 'animate-pulse')}
            aria-label={`${numTasksComplete} of ${totalSteps} steps complete`}
          />
          {loading ? (
            <Skeleton className='h-4 w-6' />
          ) : (
            <span className='text-muted-foreground shrink-0 text-xs'>
              {numTasksComplete} / {totalSteps}
            </span>
          )}
        </div>
      </div>

      <div className='space-y-4'>
        {steps.map((step, index) => (
          <VerifyStepItem
            key={index}
            {...step}
            completed={completedTasks?.[step.type] ?? false}
            onClick={() => onTaskClick?.(step.type)}
            loading={loading}
            disabled={
              completedTasks?.[step.type] || // disable if already completed
              (step.type === 'details' && !completedTasks?.['terms']) // disable details if terms not completed
            }
          />
        ))}
        <UploadProofOfAddressStep />
      </div>
    </VerifyCard>
  );
};

/** Map step types to their icon for rendering */
const StepIconMap: Record<TaskType, LucideIcon> = {
  terms: ShieldCheck,
  details: FileText,
};

type VerifyTaskItemProps = Omit<TaskItemProps, 'Icon'> & {
  type: TaskType;
};

const VerifyStepItem = (props: VerifyTaskItemProps) => {
  const icon = StepIconMap[props.type];
  return <TaskItem {...props} Icon={icon} />;
};

/** The list of steps to complete for KYC verification */
const steps: Omit<VerifyTaskItemProps, 'completed' | 'onClick'>[] = [
  {
    title: 'Accept terms of service',
    description: "Accept Bridge's Terms of Service & Privacy Policy.",
    type: 'terms',
  },
  {
    title: 'Add personal details',
    description: 'Provide your information to be verified by Persona.',
    type: 'details',
  },
];
