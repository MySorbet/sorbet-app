import { File } from 'lucide-react';

interface FileDisplayProps {
  color: string;
  key: number;
}

const FileDisplay = ({ color, key }: FileDisplayProps) => {
  return (
    <div
      key={key}
      className={`flex items-center justify-center w-[80px] h-[100px] rounded-2xl p-2 ${color}`}
    >
      <File className='w-14 h-14' />
    </div>
  );
};

export { FileDisplay };
