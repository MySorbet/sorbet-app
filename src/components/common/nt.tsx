import { forwardRef } from 'react';

export const Nt = forwardRef<
  HTMLAnchorElement,
  {
    children: React.ReactNode;
    href?: string;
    className?: string;
  }
>(({ children, href, className, ...rest }, ref) => {
  return (
    <a
      ref={ref}
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
});
