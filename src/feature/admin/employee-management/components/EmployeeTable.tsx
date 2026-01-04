import { MoreVertical } from 'lucide-react';
import React from 'react';
import { Employee } from '../types';
import { Badge } from './ui/Badge';

interface EmployeeTableProps {
  data: Employee[];
  isLoading: boolean;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-gray-200 bg-white p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        No employees found matching your criteria.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-200 bg-blue-100/40 font-medium text-slate-800">
            <tr>
              <th className="whitespace-nowrap px-6 py-4">Employee ID</th>
              <th className="whitespace-nowrap px-6 py-4">Full Name</th>
              <th className="whitespace-nowrap px-6 py-4">Work email</th>
              <th className="whitespace-nowrap px-6 py-4">Position</th>
              <th className="whitespace-nowrap px-6 py-4">Job Level</th>
              <th className="whitespace-nowrap px-6 py-4">Department</th>
              <th className="whitespace-nowrap px-6 py-4 text-center">
                Status
              </th>
              <th className="whitespace-nowrap px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((employee) => (
              <tr
                key={employee.id}
                className="group transition-colors hover:bg-blue-50/30"
              >
                <td className="px-6 py-3 font-medium text-slate-700">
                  {employee.id}
                </td>
                <td className="px-6 py-3 text-slate-900">
                  {employee.fullName}
                </td>
                <td className="px-6 py-3 text-slate-600">
                  {employee.workEmail}
                </td>
                <td className="px-6 py-3 text-slate-700">
                  {employee.position}
                </td>
                <td className="px-6 py-3 text-slate-600">
                  {employee.jobLevel}
                </td>
                <td className="px-6 py-3 text-slate-600">
                  {employee.department}
                </td>
                <td className="px-6 py-3 text-center">
                  <Badge status={employee.status} />
                </td>
                <td className="px-6 py-3 text-right">
                  <button className="rounded-full p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
