import { Widget } from './widget';

export type Widget = {
  contentUrl?: string;
  href?: string;
  iconUrl?: string;
  id: string;
  title: string;
  size: 'A' | 'B' | 'C' | 'D';
  loading?: boolean;
};

import GridLayout from 'react-grid-layout';

export const WidgetGrid = ({ widgets }: { widgets: Widget[] }) => {
  const layout = widgets.map((widget, index) => ({
    i: widget.id,
    x: index % 4,
    y: Math.floor(index / 4),
    w: 1,
    h: 1,
  }));

  console.log(layout);

  return (
    <GridLayout className='w-full' layout={layout} cols={4}>
      {widgets.map((widget) => (
        <Widget key={widget.id} {...widget} />
      ))}
    </GridLayout>
  );
};
