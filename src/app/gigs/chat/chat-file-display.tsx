'use client';

import {
  Download,
} from 'lucide-react';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';

import { fetchFile } from '@/api/chat';
import { formatBytes } from '@/app/gigs/chat/sendbird-utils';
import { Spinner } from '@/components/common';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  SBFileMessage,
  SupportedFileIcon,
  SupportedFileIcons,
} from '@/types/sendbird';

interface FileDisplayProps {
  color: string;
  file: SBFileMessage;
  fileName: string;
  fileSize: number;
  supportedIcons: SupportedFileIcons;
}

interface FileDisplayActionsProps {
  handleDownloadFile: () => void;
  color: string;
}

const FileDisplay = ({
  color,
  file,
  fileName,
  fileSize,
  supportedIcons,
}: FileDisplayProps) => {
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

  return (
    <>
      <div className='flex flex-1 flex-row gap-2 '>
        {!loading ? (
          link ? (
            <FileDisplay.Container className={color}>
              <a href={link} className='w-auto h-full'>
                <Image
                  className='object-cover h-full w-auto rounded-sm'
                  src={link}
                  width={1}
                  height={1}
                  alt={file.name}
                />
              </a>
            </FileDisplay.Container>
          ) : (
            <FileDisplay.Container className='bg-[#00000033]'>
              {
                supportedIcons[
                  file.type.split('/').pop()?.toLowerCase() as SupportedFileIcon
                ]
              }
              <p className='text-white mt-1'>
                {file.type.split('/').pop()?.toUpperCase()}
              </p>
            </FileDisplay.Container>
          )
        ) : (
          <FileDisplay.Container className={color}>
            <Spinner />
          </FileDisplay.Container>
        )}
        <div className='flex flex-col gap-1 justify-center '>
          <span className='text-xs text-[#666666]'>
            {fileName} <span className=''>{formatBytes(fileSize)}</span>
          </span>
          <Download
            className='w-4 h-4 text-[#666666] cursor-pointer'
            onClick={handleDownloadFile}
          />
        </div>
      </div>
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
        `flex flex-col items-center justify-center w-[65px] h-[80px] rounded-sm overflow-clip`,
        className
      )}
    >
      {children}
    </div>
  );
};

const Actions = ({ handleDownloadFile, color }: FileDisplayActionsProps) => {
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
    </div>
  );
};

FileDisplay.Container = Container;
FileDisplay.Actions = Actions;

export { FileDisplay };
