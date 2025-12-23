import { Calendar as DateCalendar } from '@/components/ui/calendar';
import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { Field, useField } from 'formik';
import React, { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, List, Pencil } from './Icons';

type FieldType = 'text' | 'select' | 'date';

interface FormRowProps {
  label: string;
  name: string;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
}

export const FormRow: React.FC<FormRowProps> = ({
  label,
  name,
  type = 'text',
  options = [],
  placeholder,
}) => {
  const [field, meta, helpers] = useField(name);
  const isError = meta.touched && meta.error;
  const [open, setOpen] = useState(false);

  const selectedDate = useMemo(() => {
    if (!field.value) return undefined;
    // keep same format as native date input (yyyy-MM-dd)
    return parseISO(field.value);
  }, [field.value]);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    helpers.setValue(format(date, 'yyyy-MM-dd'));
    setOpen(false);
  };

  const renderIcon = () => {
    switch (type) {
      case 'select':
        return <List className="h-4 w-4 text-gray-400" />;
      case 'date':
        return <CalendarIcon className="h-4 w-4 text-gray-400" />;
      default:
        return <Pencil className="h-4 w-4 text-gray-400" />;
    }
  };

  const icon = renderIcon();

  return (
    <div className="flex flex-col justify-between gap-2 py-2 last:border-0 sm:flex-row sm:items-center">
      <label
        htmlFor={name}
        className="w-full text-sm font-light text-slate-400 sm:w-1/3"
      >
        {label}
      </label>

      <div className="relative w-full sm:w-2/3">
        {type === 'select' ? (
          <Field
            as="select"
            name={name}
            id={name}
            className={clsx(
              'w-full appearance-none bg-transparent p-2 pr-8 text-sm text-slate-600 focus:outline-none focus:ring-0',
              isError && 'text-red-500',
            )}
          >
            <option value="" disabled className="text-gray-300">
              {placeholder || 'Select an option'}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Field>
        ) : type === 'date' ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className={clsx(
                'flex w-full items-center justify-between rounded-md border border-input bg-transparent p-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-ring',
                isError && 'border-red-300 text-red-500',
              )}
            >
              {selectedDate
                ? format(selectedDate, 'yyyy-MM-dd')
                : placeholder || 'Select a date'}
              <CalendarIcon className="h-4 w-4 text-gray-400" />
            </button>

            {open && (
              <div className="absolute z-10 mt-2 rounded-md border bg-white p-2 shadow-lg">
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
              'w-full bg-transparent p-2 pr-8 text-sm text-slate-800 placeholder:text-gray-300 focus:outline-none focus:ring-0',
              isError && 'text-red-500 placeholder:text-red-300',
            )}
          />
        )}

        {icon && (
          <div className="hover pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
      {/* Simple error tooltip capability could go here, omitting for brevity */}
    </div>
  );
};
