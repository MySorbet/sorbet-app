'use client';

import { Download } from 'lucide-react';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { fetchFile } from '@/api/chat';
import { Spinner } from '@/components/common';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  SBFileMessage,
  SupportedFileIcon,
  SupportedFileIcons,
} from '@/types/sendbird';

import { formatBytes } from './sendbird-utils';

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
      toast.error(`Failed to download ${file.name}`, {
        description: 'Please try again. If the issue persists, contact support',
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
              <a href={link} className='h-full w-auto'>
                <Image
                  className='h-full w-auto rounded-sm object-cover'
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
              <p className='mt-1 text-white'>
                {file.type.split('/').pop()?.toUpperCase()}
              </p>
            </FileDisplay.Container>
          )
        ) : (
          <FileDisplay.Container className={color}>
            <Spinner />
          </FileDisplay.Container>
        )}
        <div className='flex flex-col justify-center gap-1 '>
          <span className='text-xs text-[#666666]'>
            {fileName} <span className=''>{formatBytes(fileSize)}</span>
          </span>
          <Download
            className='h-4 w-4 cursor-pointer text-[#666666]'
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
        `flex h-[80px] w-[65px] flex-col items-center justify-center overflow-clip rounded-sm`,
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
              className={cn('h-4 w-4', color)}
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
