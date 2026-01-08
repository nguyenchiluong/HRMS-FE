interface DisplayFieldRowProps {
  label: string;
  value: string;
}

export function DisplayFieldRow({ label, value }: DisplayFieldRowProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-0 md:flex-row md:items-start">
      <div className="w-full text-sm font-medium text-gray-700 md:w-48 md:flex-shrink-0">
        {label}
      </div>
      <div className="flex-1 break-words text-sm text-gray-900">{value}</div>
    </div>
  );
}

