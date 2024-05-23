import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessagesSquare as IconMessage } from 'lucide-react';
import React, { ReactNode } from 'react';

export interface GigsCardProps {
  requester: string;
  requesterImage?: string;
  title: string;
  description?: string;
  skills: string[];
  status: string;
}

export const GigsCard = ({
  requester,
  requesterImage,
  title,
  description,
  skills,
  status,
}: GigsCardProps) => {
  return (
    <div className='flex flex-col gap-4 py-3 px-4  bg-white shadow-[0px_0px_16px_4px_rgba(0,0,0,0.12)] rounded-xl border border-2 border-solid border-[#E5E8ED] cursor-pointer'>
      <div className='flex justify-between items-center'>
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
      <div>
        <p className='text-lg font-semibold'>{title}</p>
        <p className='text-sm mt-1'>{description}</p>
        <Badge
          variant={status === 'Rejected' ? 'destructive' : 'success'}
          className='mt-3'
        >
          {status}
        </Badge>
      </div>
      <div className='flex flex-wrap gap-1'>
        {skills.map((skill: string) => (
          <span
            className='border border-1 border-gray-400 py-1 px-2 rounded-full text-xs text-center'
            key={skill}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};
