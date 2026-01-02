import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { useRequestTypes } from '../../hooks';
import { RequestType } from '../../types';

interface RequestTypeSelectProps {
  value: RequestType | null;
  onChange: (value: RequestType) => void;
}

export const RequestTypeSelect: React.FC<RequestTypeSelectProps> = ({
  value,
  onChange,
}) => {
  const { data: requestTypes, isLoading } = useRequestTypes('time-off');

  return (
    <div className="space-y-2">
      <Label className="font-regular text-sm">
        Request Type <span className="text-red-500">*</span>
      </Label>
      <Select
        value={value || ''}
        onValueChange={(val) => onChange(val as RequestType)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full max-w-xs focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder={isLoading ? 'Loading...' : 'Select request type'} />
        </SelectTrigger>
        <SelectContent>
          {requestTypes?.map((type) => (
            <SelectItem key={type.id} value={type.value}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
