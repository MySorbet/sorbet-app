import { cn } from "@/lib/utils"

import { cva, type VariantProps } from "class-variance-authority"

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-muted',
  {
    variants: {
      variant: {
        default: "",
        /* Use the `darker` variant when placeholders are rendered against a greyish background to make them visible */
        darker:
          'bg-slate-200',
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Skeleton({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Skeleton }
