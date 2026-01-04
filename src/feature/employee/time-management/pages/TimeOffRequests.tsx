import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { LeaveBalanceCards } from '../components/my-requests/LeaveBalanceCards';
import { RequestHistoryTable } from '../components/my-requests/RequestHistoryTable';
import { SubmitTimeOffRequestModal } from '../components/time-off/SubmitTimeOffRequestModal';
import {
  useCancelTimeOffRequest,
  useLeaveBalances,
  useTimeOffRequests,
} from '../hooks';

export default function TimeOffRequests() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    'pending' | 'approved' | 'rejected' | 'cancelled' | undefined
  >(undefined);

  // Fetch leave balances
  const currentYear = new Date().getFullYear();
  const { data: balances, isLoading: balancesLoading } =
    useLeaveBalances(currentYear);

  // Fetch time-off requests
  const {
    data: requestsData,
    isLoading: requestsLoading,
    refetch: refetchRequests,
  } = useTimeOffRequests({
    page: currentPage,
    limit: 10,
    status: statusFilter,
  });

  const cancelMutation = useCancelTimeOffRequest();

  const handleCancelRequest = async (request: { id: string }) => {
    try {
      await cancelMutation.mutateAsync({
        requestId: request.id,
      });
      // Data will be refetched automatically via query invalidation
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to cancel request:', error);
    }
  };

  const handleSubmitSuccess = () => {
    // Data will be refetched automatically via query invalidation
    refetchRequests();
  };

  return (
    <div className="w-full space-y-8 py-5">
      {/* Header with Submit Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-900">Time Off Requests</h1>
        <Button onClick={() => setIsModalOpen(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Submit New Request
        </Button>
      </div>

      {/* Leave Balance Section */}
      {balancesLoading ? (
        <div className="text-center text-gray-500">
          Loading leave balances...
        </div>
      ) : balances ? (
        <LeaveBalanceCards balances={balances} />
      ) : (
        <div className="text-center text-gray-500">
          No leave balance data available
        </div>
      )}

      {/* Request History Section */}
      {requestsLoading ? (
        <div className="text-center text-gray-500">Loading requests...</div>
      ) : requestsData ? (
        <RequestHistoryTable
          requests={requestsData.data}
          pagination={requestsData.pagination}
          onCancel={handleCancelRequest}
          onPageChange={setCurrentPage}
        />
      ) : (
        <div className="text-center text-gray-500">No requests found</div>
      )}

      {/* Submit Request Modal */}
      <SubmitTimeOffRequestModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleSubmitSuccess}
      />
    </div>
  );
}
