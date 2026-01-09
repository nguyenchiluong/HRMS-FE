import { Loader2, Mail, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import { Employee, EmployeeStatus } from '../types';
import { Badge } from './ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ReassignSupervisorsModal from './ReassignSupervisorsModal';
import { useResendOnboardingEmail } from '../hooks/useResendOnboardingEmail';

interface EmployeeTableProps {
  data: Employee[];
  isLoading: boolean;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  data,
  isLoading,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const resendOnboardingMutation = useResendOnboardingEmail();
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
              <th className="whitespace-nowrap px-6 py-4">Manager</th>
              <th className="whitespace-nowrap px-6 py-4">HR (Admin)</th>
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
                <td className="px-6 py-3 text-slate-600">
                  {employee.managerName ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">
                        {employee.managerName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {employee.managerEmail}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Not assigned</span>
                  )}
                </td>
                <td className="px-6 py-3 text-slate-600">
                  {employee.hrName ? (
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">
                        {employee.hrName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {employee.hrEmail}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Not assigned</span>
                  )}
                </td>
                <td className="px-6 py-3 text-center">
                  <Badge status={employee.status} />
                </td>
                <td className="px-6 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-full p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {employee.status === EmployeeStatus.Pending && (
                        <DropdownMenuItem
                          onClick={() => {
                            resendOnboardingMutation.mutate(
                              Number(employee.id),
                            );
                          }}
                          disabled={resendOnboardingMutation.isPending}
                          className="flex items-center gap-2"
                        >
                          {resendOnboardingMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                          Resend Onboarding Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setIsReassignModalOpen(true);
                        }}
                      >
                        Reassign Supervisors
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedEmployee && isReassignModalOpen && (
        <ReassignSupervisorsModal
          employee={selectedEmployee}
          onClose={() => {
            setIsReassignModalOpen(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};
