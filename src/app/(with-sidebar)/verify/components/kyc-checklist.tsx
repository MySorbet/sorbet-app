import { AlertCircle, FileText, LucideIcon, ShieldCheck } from 'lucide-react';

import { UploadProofOfAddressStep } from '@/app/(with-sidebar)/verify/components/upload-proof-of-address-step';
import {
  TaskItem,
  TaskItemProps,
} from '@/components/common/task-item/task-item';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { RejectionReason } from '@/types/bridge';

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

/** Helper function to get the most recent rejection reason */
function getLatestRejectionReason(
  rejectionReasons?: RejectionReason[]
): string | null {
  if (!rejectionReasons || rejectionReasons.length === 0) return null;

  // Sort by created_at (most recent first)
  const sorted = [...rejectionReasons].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Return the reason from the most recent rejection
  return sorted[0].reason;
}

/** A verification card rendering a checklist of KYC steps to complete */
export const KYCChecklist = ({
  onTaskClick,
  completedTasks: completedTasks,
  className,
  loading,
  indeterminate,
  isRejected,
  rejectionReasons,
}: {
  onTaskClick?: (task: TaskType) => void;
  completedTasks?: TaskStatuses;
  className?: string;
  loading?: boolean;
  indeterminate?: boolean;
  isRejected?: boolean;
  rejectionReasons?: RejectionReason[];
}) => {
  const numTasksComplete = Object.values(completedTasks ?? {}).filter(
    Boolean
  ).length;
  const progress = (numTasksComplete / totalSteps) * 100;

  return (
    <VerifyCard className={cn('min-w-72 space-y-6', className)}>
      <div className='space-y-3'>
        <h2 className='text-2xl font-semibold'>Verification steps</h2>
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
            completed={
              step.type === 'details' && isRejected
                ? false // Don't mark as completed when rejected
                : completedTasks?.[step.type] ?? false
            }
            onClick={() => onTaskClick?.(step.type)}
            loading={loading}
            disabled={
              completedTasks?.[step.type] || // disable if already completed
              (step.type === 'details' && !completedTasks?.['terms']) // disable details if terms not completed
            }
            isRejected={isRejected && step.type === 'details'}
            rejectionReason={
              isRejected && step.type === 'details'
                ? getLatestRejectionReason(rejectionReasons)
                : null
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
  isRejected?: boolean;
  rejectionReason?: string | null;
};

const VerifyStepItem = (props: VerifyTaskItemProps) => {
  const { isRejected, rejectionReason, type, ...taskItemProps } = props;
  
  // Use AlertCircle icon for 'details' step when rejected, otherwise use normal icon
  const icon = isRejected && type === 'details' ? AlertCircle : StepIconMap[type];
  
  const taskItem = (
    <div
      className={cn(
        isRejected &&
          type === 'details' &&
          '[&_svg]:text-red-500 [&_svg]:dark:text-red-400'
      )}
    >
      <TaskItem
        {...taskItemProps}
        Icon={icon}
        completed={isRejected ? false : taskItemProps.completed}
      />
    </div>
  );

  // Wrap in tooltip if rejected
  if (isRejected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{taskItem}</TooltipTrigger>
          <TooltipContent>
            <p>Identity verification failed. Please try again</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return taskItem;
};

/** The list of steps to complete for KYC verification */
const steps: Omit<VerifyTaskItemProps, 'completed' | 'onClick'>[] = [
  {
    title: 'Accept terms of service',
    description: "Accept Bridge's Terms of Service & Privacy Policy",
    type: 'terms',
  },
  {
    title: 'Add details',
    description: 'Provide your information to be verified by Persona',
    type: 'details',
  },
];
