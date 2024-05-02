import React from 'react';

const NoWidgetsContent = () => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center align-center no-widgets-content bg-white p-24 rounded-2xl border border-2 border-dashed'>
      <h2 className='text-3xl font-semibold text-sorbet'>Almost there!</h2>
      <p>You can quickly start adding widgets as following:</p>
      <div className='flex flex-col gap-4'>
        <div>
          <p>1. Select the URL of the content you'd like to add as a widget</p>
          <img
            src='https://i.imgur.com/WR2efqj.png'
            alt='step-1'
            className='rounded-xl w-2/3 h-auto mt-1'
          />
        </div>
        <div>
          <p>
            2. Paste the URL in the add widget input at the bottom of your page
          </p>
          <img
            src='https://i.imgur.com/K65Hr65.png'
            className='rounded-xl w-2/3 h-auto mt-1'
            alt='step-1'
          />
        </div>
        <div>
          <p>
            3. Hit <b className='text-sorbet'>Add</b>
          </p>
          <img
            src='https://i.imgur.com/sifKxRS.png'
            className='rounded-xl mt-1'
            alt='step-1'
          />
        </div>
      </div>
    </div>
  );
};

export { NoWidgetsContent };
