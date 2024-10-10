import {
  CoinsStacked03,
  MessageChatCircle,
  Calendar,
} from '@untitled-ui/icons-react';
import { User } from 'lucide-react';
import React, { ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
    <div className='flex cursor-pointer flex-col gap-2 rounded-xl border border-solid border-[#000000/10] bg-white shadow-[0px_0px_16px_4px_rgba(0,0,0,0.12)]'>
      <div className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-1'>
          <Avatar className='h-6 w-6 shadow-md'>
            <AvatarImage src={requesterImage} alt={requester} />
            <AvatarFallback>
              <User className='h-4 w-4 text-[#667085]' />
            </AvatarFallback>
          </Avatar>
          <div className='text-xs font-medium leading-[18px] text-[#344054]'>
            {requester}
          </div>
        </div>
        <div>
          <MessageChatCircle className='text-sorbet h-4 w-4' />
        </div>
      </div>
      <div className='px-4'>
        <p className='text-xs font-bold leading-[18px] text-[#101010]'>
          {title}
        </p>
      </div>
      <div className='flex flex-col gap-1 rounded-bl-xl rounded-br-xl bg-gray-100 px-3 pb-3 pt-2'>
        <div className='flex justify-between'>
          <div className='flex flex-row items-center gap-1'>
            <CoinsStacked03 className='h-3 w-3 text-[#344054]' />
            <span className='text-[10px] font-normal leading-[18px] text-[#344054]'>
              Budget
            </span>
          </div>
          <div className='text-[10px] leading-[18px] text-[#101010]'>
            ${budget}
          </div>
        </div>

        <div className='flex justify-between'>
          <div className='flex flex-row gap-1 items-center'>
            <Calendar className='h-3 w-3 text-[#344054]' />
            <span className='text-[10px] font-normal leading-[18px] text-[#344054]'>
              Start
            </span>
          </div>
          <div className='text-[10px] leading-[18px] text-[#101010]'>
            {projectStart}
          </div>
        </div>
      </div>
    </div>
  );
};
