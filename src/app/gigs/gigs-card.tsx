import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Database,
  MessagesSquare as IconMessage,
} from 'lucide-react';
import React, { ReactNode } from 'react';

export interface GigsCardProps {
  requester: string;
  requesterImage?: string;
  title: string;
  status: string;
  projectStart?: string;
  budget?: string;
}

export const GigsCard = ({
  requester,
  requesterImage,
  title,
  status,
  projectStart,
  budget,
}: GigsCardProps) => {
  return (
    <div className='flex flex-col gap-4 bg-white shadow-[0px_0px_16px_4px_rgba(0,0,0,0.12)] rounded-xl border border-2 border-solid border-[#E5E8ED] cursor-pointer'>
      <div className='flex justify-between items-center py-3 px-4'>
        <div className='flex gap-2 items-center'>
          <Avatar className={`w-10 h-10`}>
            <AvatarImage
              src={
                !requesterImage || requesterImage === ''
                  ? `/avatar.svg`
                  : requesterImage
              }
              alt={requester}
            />
            <AvatarFallback>{requester}</AvatarFallback>
          </Avatar>
          <div>{requester}</div>
        </div>
        <div>
          <IconMessage stroke={`#573DF5`} />
        </div>
      </div>
      <div className='px-4'>
        <p className='text-lg font-semibold'>{title}</p>
      </div>
      <div className='bg-gray-100 px-3 py-4 flex flex-col gap-2 '>
        <div className='flex justify-between'>
          <div className='flex flex-row gap-1'>
            <Database size={20} />
            <span>Budget</span>
          </div>
          <div>${budget}</div>
        </div>

        <div className='flex justify-between'>
          <div className='flex flex-row gap-1'>
            <Calendar size={20} />
            <span>Start</span>
          </div>
          <div>{projectStart}</div>
        </div>
      </div>
    </div>
  );
};
