import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ProfileChangeRequestTable } from '../components/ProfileChangeRequestTable';
import {
  ProfileChangeRequest,
  ProfileRequestStatus,
} from '../types';
import {
  useApproveProfileChangeRequest,
  useProfileChangeRequests,
  useRejectProfileChangeRequest,
} from '../hooks/useProfileChangeRequests';

type FilterStatus = 'all' | ProfileRequestStatus;

// Map frontend status to API status
const mapStatusToApi = (
  status: FilterStatus,
): 'PENDING' | 'APPROVED' | 'REJECTED' | undefined => {
  if (status === 'all') return undefined;
  return status.toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED';
};

export default function ProfileChangeRequests() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const limit = 20;

  // React Query hooks
  const {
    data: response,
    isLoading,
    isError,
  } = useProfileChangeRequests(page, limit, mapStatusToApi(filterStatus));

  const { mutate: approveRequest, isPending: isApproving } =
    useApproveProfileChangeRequest();
  const { mutate: rejectRequest, isPending: isRejecting } =
    useRejectProfileChangeRequest();

  // Map API response to component types
  const allRequests: ProfileChangeRequest[] = response?.data || [];

  // Filter requests based on selected status (client-side for consistency)
  const filteredRequests = useMemo(() => {
    if (filterStatus === 'all') return allRequests;
    return allRequests.filter((r) => r.status === filterStatus);
  }, [allRequests, filterStatus]);

  const pagination = response?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  // Calculate stats from all requests (not just current page)
  // Note: For accurate stats, we'd need to fetch all statuses separately
  // For now, we'll calculate from the current page data
  const pendingCount = allRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = allRequests.filter((r) => r.status === 'approved')
    .length;
  const rejectedCount = allRequests.filter((r) => r.status === 'rejected')
    .length;

  const handleApprove = (request: ProfileChangeRequest, notes?: string) => {
    approveRequest({
      requestId: request.id,
      data: notes ? { comment: notes } : undefined,
    });
  };

  const handleReject = (request: ProfileChangeRequest, notes: string) => {
    rejectRequest({
      requestId: request.id,
      data: { reason: notes },
    });
  };

  if (isLoading && allRequests.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-red-500">Error loading profile change requests</p>
        <p className="text-sm text-gray-600">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Profile Change Requests
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage employee profile change requests
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          All ({pagination.total})
        </Button>
        <Button
          variant={filterStatus === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('pending')}
          className={cn(
            filterStatus === 'pending' && 'bg-amber-600 hover:bg-amber-700',
          )}
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filterStatus === 'approved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('approved')}
          className={cn(
            filterStatus === 'approved' &&
              'bg-emerald-600 hover:bg-emerald-700',
          )}
        >
          Approved ({approvedCount})
        </Button>
        <Button
          variant={filterStatus === 'rejected' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('rejected')}
          className={cn(
            filterStatus === 'rejected' && 'bg-red-600 hover:bg-red-700',
          )}
        >
          Rejected ({rejectedCount})
        </Button>
      </div>

      {/* Requests Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Change Requests
            {filterStatus !== 'all' && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({pagination.total} {filterStatus})
              </span>
            )}
          </h2>
        </div>
        {filteredRequests.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">No change requests found</p>
          </div>
        ) : (
          <ProfileChangeRequestTable
            requests={filteredRequests}
            onApprove={handleApprove}
            onReject={handleReject}
            isLoading={isApproving || isRejecting}
            pagination={pagination}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
