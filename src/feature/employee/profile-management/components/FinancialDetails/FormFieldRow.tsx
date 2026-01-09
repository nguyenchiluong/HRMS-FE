import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage, Field } from 'formik';
import { Edit } from 'lucide-react';

interface FormFieldRowProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}

export function FormFieldRow({
  label,
  name,
  placeholder,
  required = false,
}: FormFieldRowProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </Label>
      <div className="flex items-center gap-2">
        <Field
          as={Input}
          id={name}
          name={name}
          placeholder={placeholder}
          className="flex-1"
        />
        <Edit className="h-4 w-4 text-gray-400" />
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-red-500"
      />
    </div>
  );
}

