import Image from 'next/image';

interface Props {
  editModal: boolean;
  popModal: any;
}

const ProfileEditModal = ({ editModal, popModal }: Props) => {
  return (
    <>
      <div
        className={`z-20 w-[500px] items-center justify-center rounded-2xl bg-[#F7F7F7] p-6 pt-4 text-black max-sm:h-5/6 max-sm:w-[300px] overflow-y-auto ${
          editModal ? 'fixed' : 'hidden'
        }`}
      >
        <div
          className='mb-3 flex cursor-pointer justify-end'
          onClick={popModal}
        >
          <img src='/images/cancel.png' alt='cancel' width={40} height={40} />
        </div>
        <div className='flex flex-col items-start gap-6 px-6 pb-6'>
          <h1 className='test-[32px]'>Edit Profile</h1>
          <div className='flex items-center gap-2'>
            <img src='/avatar.svg' alt='avatar' width={80} height={80} />
            <button className='flex h-8 items-center justify-center rounded-lg bg-[#3B3E46] px-3 py-1.5 text-white'>
              Upload
            </button>
          </div>
          <div className='row'>
            <div className='item'>
              <label className='text-[#595B5A]'>First name</label>
              <input
                className='w-full rounded-lg'
                placeholder='Jon'
                name='firstName'
              />
            </div>
            <div className='item'>
              <label className='text-[#595B5A]'>Last name</label>
              <input
                className='w-full rounded-lg'
                placeholder='Smith'
                name='lastName'
              />
            </div>
          </div>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Title</label>
            <input
              className='w-full rounded-lg'
              placeholder='Graphic Designer'
              name='title'
            />
          </div>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Location</label>
            <input
              className='w-full rounded-lg '
              placeholder='Search location'
              name='location'
            />
          </div>
          <div className='item w-full'>
            <label className='text-[#595B5A]'>Bio</label>
            <textarea
              className='w-full rounded-lg '
              placeholder='Describe yourself and your skills'
              name='bio'
              rows={4}
            />
          </div>
          <div className='item w-full'>
            <button className='h-11 gap-1 self-stretch rounded-lg bg-primary-default px-2 py-1 text-sm text-white'>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileEditModal;
