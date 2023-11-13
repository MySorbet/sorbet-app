import { useState, useEffect } from 'react';

const skills = [
  { id: 1, language: 'JavaScript', color: '#6230EC', percent: '30%' },
  { id: 2, language: 'Solidity', color: '#AB85DC', percent: '20%' },
  { id: 3, language: 'HTML', color: '#C585DC', percent: '20%' },
  { id: 4, language: 'CSS', color: '#DC859A', percent: '10%' },
  { id: 5, language: 'Solidity', color: '#F15F5F', percent: '10%' },
  { id: 6, language: 'TypeScript', color: '#rrffaa', percent: '10%' },
];

const Github = () => {
  return (
    <div className='border-gray-default flex w-[225px] flex-col items-start justify-center gap-[19px] rounded-2xl border-[0.75px] p-3'>
      <div className='flex w-full items-start justify-between gap-[9px]'>
        <div className='flex flex-col items-start gap-1'>
          <div className='flex items-center gap-1'>
            <img src='/avatar.svg' alt='avatar' width={19} height={18} />
            <div className='text-black-600/80 text-sm font-medium leading-6'>
              @namegoeshere
            </div>
          </div>
          <div className='flex items-start gap-4 text-xs font-normal leading-6'>
            <div>
              134 <span className='opacity-60'>Followers</span>
            </div>
            <div>
              45 <span className='opacity-60'>Posts</span>
            </div>
          </div>
        </div>
        <img
          src='/images/social/github.png'
          alt='github'
          width={24}
          height={24}
        />
      </div>
      <div className='flex w-full justify-center text-[10px] font-normal leading-6 text-black'>
        <div className='grid grid-cols-2 gap-x-4'>
          {skills &&
            skills.map((skill) => (
              <>
                <div className='flex items-center gap-1'>
                  <div
                    className={`h-2 w-2 rounded-full bg-[${skill.color}]`}
                  ></div>
                  <div>{skill.language}</div>
                </div>
              </>
            ))}
        </div>
      </div>
      <div className='inline-flex h-10 w-full items-start justify-start rounded-lg'>
        {skills &&
          skills.map((skill) => (
            <>
              <div
                key={skill.id}
                className={`w-[${skill.percent}] h-10 bg-[${skill.color}]`}
              ></div>
            </>
          ))}
      </div>
    </div>
  );
};

export default Github;
