import { Widget } from './widget';
import React, { useState, useEffect, useCallback } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

interface WidgetContainerProps {
  className?: string;
  items?: number;
  rowHeight?: number;
  onLayoutChange?: (layout: any) => void;
  cols?: number;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  className = 'layout',
  items = 6,
  rowHeight = 50,
  onLayoutChange = () => {},
  cols = 12,
}) => {
  const [layout, setLayout] = useState<any[]>([]);

  const generateLayout = useCallback(() => {
    return Array.from({ length: items }, (_, i) => {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        i: i.toString(),
        x: i * 2,
        y: 0,
        w: 2,
        h: 2,
      };
    });
  }, [items]);

  useEffect(() => {
    setLayout(generateLayout());
  }, [generateLayout]);

  const generateDOM = () => {
    return layout.map((item) => (
      <div key={item.i} data-grid={item}>
        <Widget key={Number(item.i)} type='Dribbble' />
      </div>
    ));
  };

  const handleLayoutChange = (newLayout: any) => {
    console.log('layout changed');
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  return (
    <ReactGridLayout
      layout={layout}
      onLayoutChange={handleLayoutChange}
      className={className}
      rowHeight={rowHeight}
      cols={cols}
    >
      {generateDOM()}
    </ReactGridLayout>
  );
};
