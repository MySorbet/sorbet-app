import { getSocialIconForWidget } from '@/components/profile/widgets';
import { WidgetType } from '@/types';
import Image from 'next/image';

interface WidgetIconProps {
  type: WidgetType;
  noMargin?: boolean;
}

/**
 * This misnamed component renders the icon for a widget.
 */
export const WidgetIcon: React.FC<WidgetIconProps> = ({ type, noMargin }) => {
  return (
    <div className={noMargin ? '' : 'mb-4'}>
      <Image
        src={getSocialIconForWidget(type)}
        alt={type}
        width={30}
        height={30}
      />
    </div>
  );
};
