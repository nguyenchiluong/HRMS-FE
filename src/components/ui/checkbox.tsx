import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const uniqueId = React.useId();
    const inputId = id || uniqueId;

    return (
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            className={cn(
              'peer h-4 w-4 shrink-0 appearance-none rounded border border-slate-300 bg-white transition-colors',
              'checked:border-slate-900 checked:bg-slate-900',
              'focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            {...props}
          />
          <Check
            className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            strokeWidth={3}
          />
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className="cursor-pointer select-none text-sm font-medium leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
