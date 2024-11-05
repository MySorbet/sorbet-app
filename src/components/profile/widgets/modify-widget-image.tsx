import { Trash2 } from 'lucide-react';
import { Image03, LinkExternal02 } from '@untitled-ui/icons-react';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';

interface ModifyImageWidgetProps {
  identifier: string;
  addImage: (key: string, image: File) => Promise<void>;
  setErrorInvalidImage: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export const ModifyImageWidget: React.FC<ModifyImageWidgetProps> = ({
  identifier,
  addImage,
  setErrorInvalidImage,
  className,
}) => {
  const btnClass = 'h-4 w-7 flex items-center justify-center';
  const dividerClass = 'h-4 w-[2.5px] bg-[#344054] rounded-full mx-2';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
      const fileSize = file.size / 1024 / 1024; // in MB
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension) {
        return;
      }

      if (validExtensions.includes(fileExtension) && fileSize <= 10) {
        addImage(identifier, file);
      } else {
        setErrorInvalidImage(true);
      }
    } else {
      setErrorInvalidImage(true);
    }
  };

  return (
    <div
      className={cn(
        'align-center z-20 flex hidden min-h-[36px] min-w-[112px] cursor-pointer flex-row items-center justify-center rounded-full bg-[#667085] text-white',
        className
      )}
    >
      <div className={btnClass}>
        <label>
          <input
            type='file'
            className='hidden'
            onChange={handleImageUpload}
            accept='image/*'
          />
          <Image03 width={16} height={16} strokeWidth={2.5} />
        </label>
      </div>
      <div className={btnClass}>
        <LinkExternal02 width={16} height={16} strokeWidth={2.5} />
      </div>

      <div className={dividerClass} />
      <div className={btnClass}>
        <Trash2 size={18} />
      </div>
    </div>
  );
};
