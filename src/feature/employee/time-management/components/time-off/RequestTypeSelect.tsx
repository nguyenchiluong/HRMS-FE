import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { RequestType } from '../../types';

const requestOptions = [
  { id: 'paid-leave', label: 'Paid Leave' },
  { id: 'unpaid-leave', label: 'Unpaid Leave' },
  { id: 'paid-sick-leave', label: 'Paid Sick Leave' },
  { id: 'unpaid-sick-leave', label: 'Unpaid Sick Leave' },
  { id: 'wfh', label: 'Work From Home (WFH)' },
];

interface RequestTypeSelectProps {
  value: RequestType | null;
  onChange: (value: RequestType) => void;
}

export const RequestTypeSelect: React.FC<RequestTypeSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label className="font-regular text-sm">
        Request Type <span className="text-red-500">*</span>
      </Label>
      <Select
        value={value || ''}
        onValueChange={(val) => onChange(val as RequestType)}
      >
        <SelectTrigger className="w-full max-w-xs focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Select request type" />
        </SelectTrigger>
        <SelectContent>
          {requestOptions.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
