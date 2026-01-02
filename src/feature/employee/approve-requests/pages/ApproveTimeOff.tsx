import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { TimeOffApprovalTable } from '../components/approve-time-off/TimeOffApprovalTable';
import { ApprovalStatus, TimeOffApprovalRequest, TimeOffType } from '../types';

// Mock data for demonstration
const generateMockTimeOffRequests = (): TimeOffApprovalRequest[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const names = [
    'John Smith',
    'Sarah Johnson',
    'Mike Chen',
    'Emily Davis',
    'Alex Wilson',
    'Lisa Brown',
    'David Lee',
    'Jennifer Garcia',
    'Robert Martinez',
    'Amanda Taylor',
  ];
  const types: TimeOffType[] = [
    'paid-leave',
    'unpaid-leave',
    'paid-sick-leave',
    'unpaid-sick-leave',
    'wfh',
  ];
  const reasons = [
    'Family vacation',
    'Personal matters',
    'Medical appointment',
    'Home renovation',
    'Childcare',
    'Wedding attendance',
    'Moving to new apartment',
    'Feeling unwell',
    'Doctor visit',
    'Working on focused project',
  ];

  const requests: TimeOffApprovalRequest[] = [];
  const today = new Date();

  for (let i = 0; i < 15; i++) {
    const submittedDate = new Date(today);
    submittedDate.setDate(today.getDate() - Math.floor(Math.random() * 14));

    const startDate = new Date(today);
    startDate.setDate(today.getDate() + Math.floor(Math.random() * 30));

    const duration = 1 + Math.floor(Math.random() * 5);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration - 1);

    const status = i < 6 ? 'PENDING' : i < 11 ? 'APPROVED' : 'REJECTED';

    requests.push({
      id: `TO-${String(i + 1).padStart(4, '0')}`,
      employeeId: `EMP-${String(i + 1).padStart(4, '0')}`,
      employeeName: names[i % names.length],
      employeeEmail: `${names[i % names.length].toLowerCase().replace(' ', '.')}@company.com`,
      department: departments[i % departments.length],
      type: types[i % types.length],
      startDate,
      endDate,
      duration,
      reason: reasons[i % reasons.length],
      submittedDate,
      status: status as ApprovalStatus,
    });
  }

  return requests;
};

type FilterStatus = 'all' | ApprovalStatus;

export default function ApproveTimeOff() {
  const [allRequests, setAllRequests] = useState<TimeOffApprovalRequest[]>(
    generateMockTimeOffRequests,
  );
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // Calculate stats
  const pendingCount = allRequests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = allRequests.filter(
    (r) => r.status === 'APPROVED',
  ).length;
  const rejectedCount = allRequests.filter(
    (r) => r.status === 'REJECTED',
  ).length;

  // Filter requests based on selected status
  const requests =
    filterStatus === 'all'
      ? allRequests
      : allRequests.filter((r) => r.status === filterStatus);

  const handleApprove = (request: TimeOffApprovalRequest, notes?: string) => {
    setAllRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? { ...r, status: 'APPROVED' as ApprovalStatus, notes }
          : r,
      ),
    );
  };

  const handleReject = (request: TimeOffApprovalRequest, notes: string) => {
    setAllRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? { ...r, status: 'REJECTED' as ApprovalStatus, notes }
          : r,
      ),
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Approve Time-off
        </h1>
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
              <span className="ml-2 text-xs font-normal text-gray-500">
                ({requests.length} {filterStatus.toLowerCase()})
              </span>
            )}
          </h2>
        </div>
        <TimeOffApprovalTable
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
