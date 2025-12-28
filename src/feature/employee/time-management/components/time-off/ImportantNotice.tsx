import { AlertCircle } from 'lucide-react';
import React from 'react';

interface ImportantNoticeProps {
  title?: string;
  message: string;
}

export const ImportantNotice: React.FC<ImportantNoticeProps> = ({
  title = 'Important:',
  message,
}) => {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-gray-50 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 text-gray-500" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
