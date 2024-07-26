export const WidgetDescription: React.FC<{ description: string }> = ({
  description,
}) => {
  const DESCRIPTION_CHARS_LIMIT = 60;
  return (
    <span>
      {description.length > DESCRIPTION_CHARS_LIMIT
        ? `${description.substring(0, DESCRIPTION_CHARS_LIMIT)}...`
        : description}
    </span>
  );
};
