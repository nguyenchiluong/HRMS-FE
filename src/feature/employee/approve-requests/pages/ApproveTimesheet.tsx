import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { TimesheetApprovalTable } from '../components/approve-timesheet/TimesheetApprovalTable';
import {
  useApproveTimesheet,
  usePendingApprovals,
  useRejectTimesheet,
} from '../hooks/useTimesheetApproval';
import type { TimesheetApprovalRequest } from '../types';

type FilterStatus = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function ApproveTimesheet() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const limit = 20;

  // React Query hooks
  const {
    data: response,
    isLoading,
    isFetching,
  } = usePendingApprovals(page, limit);

  const { mutate: approveTimesheet, isPending: isApproving } =
    useApproveTimesheet();
  const { mutate: rejectTimesheet, isPending: isRejecting } =
    useRejectTimesheet();

  // Map API response to component types
  const allRequests: TimesheetApprovalRequest[] = response?.data || [];

  // Filter requests based on selected status
  const requests = useMemo(() => {
    if (filterStatus === 'all') return allRequests;
    return allRequests.filter((r) => r.status === filterStatus);
  }, [allRequests, filterStatus]);

  const pagination = response?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  // Calculate stats
  const pendingCount = allRequests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = allRequests.filter(
    (r) => r.status === 'APPROVED',
  ).length;
  const rejectedCount = allRequests.filter(
    (r) => r.status === 'REJECTED',
  ).length;

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
    <div className="w-full space-y-6 py-5">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-medium text-gray-900">Approve Timesheet</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and approve employee timesheet submissions
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          All ({allRequests.length})
        </Button>
        <Button
          variant={filterStatus === 'PENDING' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('PENDING')}
          className={cn(
            filterStatus === 'PENDING' && 'bg-amber-600 hover:bg-amber-700',
          )}
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filterStatus === 'APPROVED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('APPROVED')}
          className={cn(
            filterStatus === 'APPROVED' &&
              'bg-emerald-600 hover:bg-emerald-700',
          )}
        >
          Approved ({approvedCount})
        </Button>
        <Button
          variant={filterStatus === 'REJECTED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('REJECTED')}
          className={cn(
            filterStatus === 'REJECTED' && 'bg-red-600 hover:bg-red-700',
          )}
        >
          Rejected ({rejectedCount})
        </Button>
      </div>

      {/* Approval Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Timesheet Requests
            {filterStatus !== 'all' && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({requests.length} {filterStatus.toLowerCase()})
              </span>
            )}
          </h2>
        </div>
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
