import { cn } from "@/lib/utils"

import { cva, type VariantProps } from "class-variance-authority"

const skeletonVariants = cva(
  'animate-pulse rounded-md bg-muted',
  {
    variants: {
      variant: {
        default: "",
        lighter:
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
