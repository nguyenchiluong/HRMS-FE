import React from 'react';
import { EmployeeOnboardingStore } from '../store';

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-1 gap-4 py-1.5 sm:grid-cols-3">
    <dt className="text-sm font-normal text-slate-900">{label}</dt>
    <dd className="text-sm text-gray-500 sm:col-span-2">{value}</dd>
  </div>
);

export const JobDetailsSection: React.FC = () => {
  const { jobDetails } = EmployeeOnboardingStore();

  return (
    <section className="mb-10">
      <h3 className="mb-4 font-medium text-slate-900">Job Details</h3>
      <div className="space-y-0.5 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <DetailRow label="Position" value={jobDetails.position} />
        <DetailRow label="Job Level" value={jobDetails.jobLevel} />
        <DetailRow label="Department" value={jobDetails.department} />
        <DetailRow label="Employee Type" value={jobDetails.employeeType} />
        <DetailRow label="Time Type" value={jobDetails.timeType} />
        <DetailRow label="On board Date" value={jobDetails.onboardDate} />
      </div>
    </section>
  );
};
