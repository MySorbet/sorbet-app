import { X } from '@untitled-ui/icons-react';

import { Button } from '@/components/ui/button';

interface CloseButtonProps {
  onClick: () => void;
  height?: number;
  width?: number;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  height = 6,
  width = 6,
}) => {
  return (
    <Button
      onClick={onClick}
      variant='ghost'
      className={`h-${height} w-${width} p-0 transition ease-out hover:scale-110`}
    >
      <X
        className={`h-${height} w-${width} text-muted-foreground cursor-pointer`}
      />
    </Button>
  );
};
