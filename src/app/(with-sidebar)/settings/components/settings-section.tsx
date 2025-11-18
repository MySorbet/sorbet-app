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
    <div className='flex w-full flex-col gap-6 lg:flex-row'>
      <div className='flex min-w-0 flex-col gap-2 lg:w-[466px] lg:flex-shrink-0'>
        <span className='text-xl font-semibold'>{label}</span>
        <span className='text-muted-foreground text-sm font-normal'>
          {description}
        </span>
      </div>
      <div className='flex flex-1 flex-col gap-2'>{children}</div>
    </div>
  );
};
