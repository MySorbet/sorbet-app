import React from 'react';

interface SectionTitleWidgetProps {
  title: string;
}

export const SectionTitleWidget: React.FC<SectionTitleWidgetProps> = ({
  title,
}) => {
  return (
    <div
      className='section-title-widget'
      style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
      }}
    >
      <h2>{title}</h2>
    </div>
  );
};
