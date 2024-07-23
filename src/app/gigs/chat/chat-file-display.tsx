'use client';

import { fetchFile } from '@/api/chat';
import { useToast } from '@/components/ui/use-toast';
import { SBFileMessage } from '@/types/sendbird';
import { File } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface FileDisplayProps {
  color: string;
  file: SBFileMessage;
}

const FileDisplay = ({ color, file }: FileDisplayProps) => {
  const [urlRoute, setUrlRoute] = useState('');
  const { toast } = useToast();

  const handleDownload = async () => {
    console.log('firing fetchFile');
    const res = await fetchFile(file.sendbirdUrl, file.type);
    console.log('res in file display', res);
    if (!res) {
      toast({
        title: 'There was an error opening this file.',
        variant: 'destructive',
      });
      return;
    }
    const a = document.createElement('a');
    a.href = res;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(res);
  };

  return (
    <button
      onClick={handleDownload}
      className={`flex items-center justify-center w-[80px] h-[100px] rounded-2xl p-2 ${color}`}
    >
      <File className='w-14 h-14' />
    </button>
  );
};

export { FileDisplay };
