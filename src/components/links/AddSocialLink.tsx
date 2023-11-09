import Image from 'next/image';
interface Props {
  showAddLink: boolean;
  toggleAddLink: any;
}

const socialLinks = [
  { id: 1, name: 'social_1.png' },
  { id: 2, name: 'social_2.png' },
  { id: 3, name: 'social_3.png' },
  { id: 4, name: 'social_4.png' },
  { id: 5, name: 'social_5.png' },
  { id: 6, name: 'social_6.png' },
];

const AddSocialLink = ({ showAddLink }: Props) => {
  return (
    <>
      {showAddLink && (
        <div className='right-7.5 absolute bottom-[84px] flex w-[315px] flex-col items-start gap-0.5'>
          {socialLinks &&
            socialLinks.map((socialItem) => (
              <>
                <div
                  key={"social"+socialItem.id}
                  className='self-strech bg-primary flex h-11 w-full items-center justify-end gap-2 rounded-lg border-2 border-solid border-gray-100 bg-[#FAFAFA] py-2.5 pl-4 pr-2'
                >
                  <Image
                    src={`/images/social/${socialItem.name}`}
                    alt={socialItem.name}
                    width={24}
                    height={24}
                  />
                  <input
                    className='h-6 w-full border-none bg-[#FAFAFA]'
                    placeholder='Paste link here'
                  />
                  <button className='gap-2 rounded-lg bg-[#6230EC] px-3 py-1.5 text-sm text-white'>
                    Add
                  </button>
                </div>
              </>
            ))}
        </div>
      )}
    </>
  );
};

export default AddSocialLink;
