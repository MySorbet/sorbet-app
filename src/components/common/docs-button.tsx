import { Button } from '@/components/ui/button';

import { Nt } from './nt';

/**
 * A link pointing to the Sorbet docs disguised as an outline button.
 */
export const DocsButton = ({ subpath }: { subpath?: string }) => {
  return (
    <Button variant='outline' asChild>
      <Nt href={`https://docs.mysorbet.xyz/${subpath ?? ''}`}>Docs</Nt>
    </Button>
  );
};
