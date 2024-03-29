import { WidgetType } from '@/types';
import { getSocialIconForWidget } from '@/utils/icons';

interface WidgetHeaderProps {
  type: WidgetType;
  noMargin?: boolean;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  type,
  noMargin,
}) => {
  return (
    <div className={noMargin ? '' : 'mb-4'}>
      <img
        src={getSocialIconForWidget(type)}
        alt={type}
        width={30}
        height={30}
      />
    </div>
  );
};
