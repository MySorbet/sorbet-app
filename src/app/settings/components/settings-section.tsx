interface SettingsSectionProps {
  label: string;
  description: string;
  children: React.ReactNode;
}

export const SettingsSection = ({
  label,
  description,
  children,
}: SettingsSectionProps) => {
  return (
    <div className='flex flex-col justify-between gap-6 lg:flex-row'>
      <div className='flex flex-col gap-2'>
        <span className='text-xl font-semibold'>{label}</span>
        <span className='text-muted-foreground text-sm font-normal'>
          {description}
        </span>
      </div>
      <div className='flex flex-1 flex-col items-end gap-2'>{children}</div>
    </div>
  );
};
