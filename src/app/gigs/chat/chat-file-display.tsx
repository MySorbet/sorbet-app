'use client';

import { fetchFile } from '@/api/chat';
import { Spinner } from '@/components/common';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { SBFileMessage } from '@/types/sendbird';
import { Download, ExternalLink, File, Frown } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

interface FileDisplayProps {
  color: string;
  file: SBFileMessage;
}

interface FileDisplayActionsProps {
  handleDownloadFile: () => void;
  handleOpenFile: () => void;
  color;
}

const FileDisplay = ({ color, file }: FileDisplayProps) => {
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    async function initLink() {
      setLoading(true);
      const res = await fetchFile(file.sendbirdUrl, file.type);
      if (res) {
        setLink(res);
      }
      setLoading(false);
    }

    initLink();
  }, []);

  const handleDownloadFile = async () => {
    if (!link) {
      toast({
        title: `Failed to download ${file.name}`,
        description: 'Please try again. If the issue persists, contact support',
        variant: 'destructive',
      });
      return;
    }
    const a = document.createElement('a');
    a.href = link;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(link);
  };

  const handleOpenFile = async () => {
    if (!link) {
      toast({
        title: `Failed to download ${file.name}`,
        description: 'Please try again. If the issue persists, contact support',
        variant: 'destructive',
      });
      return;
    }
    window.open(link, '_blank');
  };

  return (
    <>
      {!loading ? (
        link ? (
          <FileDisplay.Container className={color}>
            <FileDisplay.Actions
              color={color}
              handleOpenFile={handleOpenFile}
              handleDownloadFile={handleDownloadFile}
            />
            <File className='w-10 h-10' />
            {file.type.split('/').pop()}
          </FileDisplay.Container>
        ) : (
          <FileDisplay.Container>
            <Frown className='w-10 h-10 text-white' />
          </FileDisplay.Container>
        )
      ) : (
        <FileDisplay.Container className={color}>
          <Spinner />
        </FileDisplay.Container>
      )}
    </>
  );
};

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        `flex flex-col items-center justify-center w-[80px] h-[100px] rounded-2xl px-1 gap-1`,
        className
      )}
    >
      {children}
    </div>
  );
};

const Actions = ({
  handleDownloadFile,
  handleOpenFile,
  color,
}: FileDisplayActionsProps) => {
  return (
    <div className='flex w-full justify-between'>
      <TooltipProvider delayDuration={200} skipDelayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <Download
              className={cn('w-4 h-4', color)}
              onClick={handleDownloadFile}
            />
          </TooltipTrigger>
          <TooltipContent>Download file</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={200} skipDelayDuration={100}>
        <Tooltip>
          <TooltipTrigger>
            <ExternalLink
              className={cn('w-4 h-4', color)}
              onClick={handleOpenFile}
            />
          </TooltipTrigger>
          <TooltipContent>Open file</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

FileDisplay.Container = Container;
FileDisplay.Actions = Actions;

export { FileDisplay };
