import React from 'react';
import { EmployeeStatus } from '../../types';

interface BadgeProps {
  status: EmployeeStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  let styles = '';

  switch (status) {
    case EmployeeStatus.Active:
      styles = 'bg-green-700 text-white';
      break;
    case EmployeeStatus.Pending:
      styles = 'bg-amber-400 text-black';
      break;
    case EmployeeStatus.Inactive:
      styles = 'bg-gray-600 text-white';
      break;
    default:
      styles = 'bg-gray-200 text-gray-800';
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-0.5 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
};
