import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { TimeOffApprovalTable } from '../components/approve-time-off/TimeOffApprovalTable';
import {
  useApproveTimeOff,
  usePendingTimeOffApprovals,
  useRejectTimeOff,
} from '../hooks/useTimeOffApproval';
import { ApprovalStatus, TimeOffApprovalRequest } from '../types';

type FilterStatus = 'all' | ApprovalStatus;

export default function ApproveTimeOff() {
  const [page] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const limit = 20;

  // Always fetch all requests (no status filter) - filter client-side like timesheet page
  // React Query hooks
  const {
    data: response,
    isLoading,
    isFetching,
  } = usePendingTimeOffApprovals(page, limit);

  const { mutate: approveTimeOff, isPending: isApproving } =
    useApproveTimeOff();
  const { mutate: rejectTimeOff, isPending: isRejecting } = useRejectTimeOff();

  // Map API response to component types
  const allRequests: TimeOffApprovalRequest[] = useMemo(() => {
    if (!response?.data) return [];

    return response.data
      .filter((req) => {
        // Filter out timesheet requests, only keep time-off requests
        const timeOffTypes = [
          'PAID_LEAVE',
          'UNPAID_LEAVE',
          'PAID_SICK_LEAVE',
          'UNPAID_SICK_LEAVE',
          'WFH',
        ];
        return timeOffTypes.includes(req.type);
      })
      .map((req) => {
        // Map request type from API format to frontend format
        const typeMap: Record<string, TimeOffApprovalRequest['type']> = {
          PAID_LEAVE: 'paid-leave',
          UNPAID_LEAVE: 'unpaid-leave',
          PAID_SICK_LEAVE: 'paid-sick-leave',
          UNPAID_SICK_LEAVE: 'unpaid-sick-leave',
          WFH: 'wfh',
        };

        return {
          id: req.id,
          employeeId: req.employeeId,
          employeeName: req.employeeName,
          employeeEmail: req.employeeEmail,
          employeeAvatar: req.employeeAvatar || undefined,
          department: req.department || '',
          type: typeMap[req.type] || 'paid-leave',
          startDate: req.startDate ? new Date(req.startDate) : new Date(),
          endDate: req.endDate ? new Date(req.endDate) : new Date(),
          duration: req.duration || 0,
          reason: req.reason,
          submittedDate: new Date(req.submittedDate),
          status: req.status as ApprovalStatus,
          attachments: req.attachments || [],
        };
      });
  }, [response]);

  // Filter requests based on selected status (client-side filtering for stats)
  const requests = useMemo(() => {
    if (filterStatus === 'all') return allRequests;
    return allRequests.filter((r) => r.status === filterStatus);
  }, [allRequests, filterStatus]);

  // Calculate stats from all requests (not filtered)
  const pendingCount = allRequests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = allRequests.filter(
    (r) => r.status === 'APPROVED',
  ).length;
  const rejectedCount = allRequests.filter(
    (r) => r.status === 'REJECTED',
  ).length;

  const handleApprove = useCallback(
    async (request: TimeOffApprovalRequest, notes?: string) => {
      approveTimeOff({
        requestId: request.id,
        data: { comment: notes },
      });
    },
    [approveTimeOff],
  );

  const handleReject = useCallback(
    async (request: TimeOffApprovalRequest, notes: string) => {
      rejectTimeOff({
        requestId: request.id,
        data: { reason: notes },
      });
    },
    [rejectTimeOff],
  );

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
        <h1 className="text-xl font-medium text-gray-900">Approve Time-off</h1>
        <p className="mt-1 text-xs text-gray-500">
          Review and approve employee time-off requests
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
            Time-off Requests
            {filterStatus !== 'all' && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({requests.length} {filterStatus.toLowerCase()})
              </span>
            )}
          </h2>
        </div>
        <TimeOffApprovalTable
          requests={requests}
          isLoading={isFetching}
          isApproving={isApproving}
          isRejecting={isRejecting}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
