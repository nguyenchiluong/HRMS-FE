import React from 'react';
import type { OnboardingInfo } from '../types';

interface JobDetailsSectionProps {
  onboardingInfo: OnboardingInfo;
}

export const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({
  onboardingInfo,
}) => {
  const details = [
    { label: 'Position', value: onboardingInfo.positionTitle },
    { label: 'Department', value: onboardingInfo.departmentName },
    { label: 'Start Date', value: onboardingInfo.startDate },
    {
      label: 'Type',
      value: `${onboardingInfo.employeeType ?? ''} · ${onboardingInfo.timeType ?? ''}`,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Your Position
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label}>
            <dt className="text-xs font-medium text-slate-400">{item.label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-slate-900">
              {item.value}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
};
