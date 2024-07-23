'use client';

import { fetchFile } from '@/api/chat';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { SBFileMessage } from '@/types/sendbird';
import { Download, ExternalLink, File, Frown, HeartCrack } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FileDisplayProps {
  color: string;
  file: SBFileMessage;
}

const FileDisplay = ({ color, file }: FileDisplayProps) => {
  const [link, setLink] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function initLink() {
      const res = await fetchFile(file.sendbirdUrl, file.type);
      if (res) {
        setLink(res);
      }
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
      {link ? (
        <div
          className={`flex flex-col items-center justify-center w-[80px] h-[100px] rounded-2xl px-1 gap-1 ${color} `}
        >
          <div className='flex w-full justify-between'>
            <TooltipProvider delayDuration={200} skipDelayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Download
                    className='w-4 h-4 text-white'
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
                    className='w-4 h-4 text-white'
                    onClick={handleOpenFile}
                  />
                </TooltipTrigger>
                <TooltipContent>Open file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <File className='w-10 h-10' />
          {file.type.split('/').pop()}
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center w-[80px] h-[100px] rounded-2xl p-2 bg-gray-600 text-white`}
        >
          <Frown className='w-14 h-14' />
        </div>
      )}
    </>
  );
};

export { FileDisplay };
