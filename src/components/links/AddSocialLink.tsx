/* eslint-disable @next/next/no-img-element */
interface Props {
  showAddLink: boolean;
  toggleAddLink: any;
}

const socialLinks = [
  { id: 1, name: 'dribble.png' },
  { id: 2, name: 'github.png' },
  { id: 3, name: 'soundCloud.png' },
  { id: 4, name: 'spotify.png' },
  { id: 5, name: 'instgram.png' },
  { id: 6, name: 'youtube.png' },
];

const AddSocialLink = ({ showAddLink }: Props) => {
  return (
    <>
      {showAddLink && (
        <div className='right-7.5 absolute bottom-[84px] flex w-[315px] flex-col items-start gap-0.5'>
          {socialLinks &&
            socialLinks.map((socialItem) => (
              <div
                key={socialItem.id}
                className='self-strech bg-primary flex h-11 w-full items-center justify-end gap-2 rounded-lg border-2 border-solid border-gray-100 bg-[#FAFAFA] py-2.5 pl-4 pr-2'
              >
                <img
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
            ))}
        </div>
      )}
    </>
  );
};

export default AddSocialLink;
