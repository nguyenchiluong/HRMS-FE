import { Calendar as DateCalendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { Field, useField } from 'formik';
import { Calendar } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';

type FieldType = 'text' | 'select' | 'date';

interface FormRowProps {
  label: string;
  name: string;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export const FormRow: React.FC<FormRowProps> = ({
  label,
  name,
  type = 'text',
  options = [],
  placeholder,
  required = false,
}) => {
  const [field, meta, helpers] = useField(name);
  const isError = meta.touched && meta.error;
  const [open, setOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const selectedDate = useMemo(() => {
    if (!field.value) return undefined;
    return parseISO(field.value);
  }, [field.value]);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    helpers.setValue(format(date, 'yyyy-MM-dd'));
    setOpen(false);
  };

  const handleSelectChange = (value: string) => {
    helpers.setValue(value);
    helpers.setTouched(true, false);
  };

  return (
    <div className="py-2">
      <label
        htmlFor={name}
        className={clsx(
          'mb-1 block text-sm font-medium',
          isError ? 'text-red-500' : 'text-slate-600',
        )}
      >
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>

      {type === 'select' ? (
        <Select value={field.value || undefined} onValueChange={handleSelectChange}>
          <SelectTrigger
            id={name}
            className={clsx(
              'w-full rounded-lg border-slate-200 bg-slate-50 text-sm',
              isError && 'border-red-300',
              !field.value && 'text-slate-400',
            )}
          >
            <SelectValue placeholder={placeholder || 'Select...'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type === 'date' ? (
        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className={clsx(
              'flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200',
              isError && 'border-red-300',
              !selectedDate && 'text-slate-400',
            )}
          >
            {selectedDate ? format(selectedDate, 'MMM d, yyyy') : placeholder || 'Select date...'}
            <Calendar className="h-4 w-4 text-slate-400" />
          </button>

          {open && (
            <div className="absolute left-0 z-50 mt-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
              <DateCalendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                autoFocus
                captionLayout="dropdown"
                startMonth={new Date(1950, 0, 1)}
                endMonth={new Date(2050, 11, 31)}
              />
            </div>
          )}
        </div>
      ) : (
        <Field
          type="text"
          name={name}
          id={name}
          placeholder={placeholder}
          className={clsx(
            'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 transition-colors hover:bg-slate-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200',
            isError && 'border-red-300',
          )}
        />
      )}

      {isError && <p className="mt-1 text-xs text-red-500">{meta.error}</p>}
    </div>
  );
};
