import React from 'react';

interface SectionHeaderProps {
  title: string;
  optional?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  optional,
}) => {
  return (
    <h3 className="mb-6 flex items-center gap-4 text-base font-medium text-primary">
      {title}
      {optional && (
        <span className="text-sm font-normal text-gray-400"> (optional)</span>
      )}
    </h3>
  );
};
