import { cn } from "@/lib/utils";
import { ReactNode } from 'react';

export const Body = ({ children, className }: { children: ReactNode, className?:string }) => {
  return (
    <div className={cn('flex h-full w-full flex-col gap-10 px-2 py-4', className)}>
      {children}
    </div>
  );
};
