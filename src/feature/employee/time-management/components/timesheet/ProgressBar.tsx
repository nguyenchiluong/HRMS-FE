import { cn } from '@/lib/utils';
import React from 'react';
import { MAX_HOURS_PER_WEEK } from '../../store/useTimesheetStore';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Monthly Working Hours Progress
        </span>
        <span className="text-sm font-semibold text-blue-600">{progress}%</span>
      </div>
      <div className="h-5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            progress >= 100
              ? 'bg-green-500'
              : progress >= 75
                ? 'bg-blue-400'
                : progress >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-400',
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Based on {MAX_HOURS_PER_WEEK} hours per week (excludes Leave)
      </p>
    </div>
  );
};
