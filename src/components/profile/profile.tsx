import React from 'react';

export const Profile: React.FC = () => {
  return (
    <div>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-center'>
          {/* <Avatar
            size={`2xl`}
            src='https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop'
          /> */}
        </div>
        <div className='flex justify-center'>
          <h1 className='text-2xl font-semibold'>Humza Khan</h1>
        </div>
        <div className='flex justify-center'>
          <div className='w-5/12'>
            <h1 className='text-3xl font-semibold text-center'>
              Hello, I'm a Senior Product Engineer based in Montreal, Canada.
            </h1>
          </div>
        </div>
        <div className='flex flex-row gap-2 justify-center'>
          {/* <Tag borderRadius={`xl`}>Full Stack Development</Tag>
          <Tag borderRadius={`xl`}>Product Engineering</Tag>
          <Tag borderRadius={`xl`}>DevOps</Tag> */}
        </div>
        <div className='flex flex-row gap-3 justify-center mt-6'>
          {/* <Button
            bgColor={`#573DF5`}
            textColor={`white`}
            fontWeight={`semibold`}
            borderRadius={`xl`}
            size={`lg`}
            _hover={{ bgColor: '#573DF5' }}
          >
            Hire me
          </Button>
          <Button
            variant='outline'
            fontWeight={`semibold`}
            borderRadius={`xl`}
            size={`lg`}
          >
            Edit Profile
          </Button> */}
        </div>
      </div>
    </div>
  );
};
