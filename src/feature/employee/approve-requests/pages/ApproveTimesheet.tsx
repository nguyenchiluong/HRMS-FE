import { Card } from '@/components/ui/card';
import {
  useApproveTimesheet,
  usePendingApprovals,
  useRejectTimesheet,
} from '../hooks/useTimesheetApproval';
import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { TimesheetApprovalTable } from '../components/approve-timesheet/TimesheetApprovalTable';
import type { TimesheetApprovalRequest } from '../types';

export default function ApproveTimesheet() {
  const [page, setPage] = useState(1);
  const limit = 20;

  // React Query hooks
  const {
    data: response,
    isLoading,
    isFetching,
  } = usePendingApprovals(page, limit);

  const { mutate: approveTimesheet, isPending: isApproving } = useApproveTimesheet();
  const { mutate: rejectTimesheet, isPending: isRejecting } = useRejectTimesheet();

  // Map API response to component types
  const requests: TimesheetApprovalRequest[] = (response?.data || []).map((ts) => ({
    requestId: ts.requestId,
    employeeId: ts.employeeId,
    employeeName: ts.employeeName,
    department: ts.department,
    year: ts.year,
    month: ts.month,
    weekNumber: ts.weekNumber,
    weekStartDate: ts.weekStartDate,
    weekEndDate: ts.weekEndDate,
    summary: ts.summary,
    submittedAt: ts.submittedAt,
    status: ts.status as TimesheetApprovalRequest['status'],
  }));

  const pagination = response?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  // Calculate stats
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  const handleApprove = useCallback(
    async (request: TimesheetApprovalRequest, comment?: string) => {
      approveTimesheet({
        requestId: request.requestId,
        data: { comment },
      });
    },
    [approveTimesheet],
  );

  const handleReject = useCallback(
    async (request: TimesheetApprovalRequest, reason: string) => {
      rejectTimesheet({
        requestId: request.requestId,
        data: { reason },
      });
    },
    [rejectTimesheet],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  if (isLoading && requests.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {approvedCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {rejectedCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Approval Table */}
      <div>
        <h2 className="font-regular text-md mb-4 text-gray-900">
          Timesheet Requests
        </h2>
        <TimesheetApprovalTable
          requests={requests}
          pagination={pagination}
          isLoading={isFetching}
          isApproving={isApproving}
          isRejecting={isRejecting}
          onApprove={handleApprove}
          onReject={handleReject}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
