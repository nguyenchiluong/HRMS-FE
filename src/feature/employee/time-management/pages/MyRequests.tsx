import { useState } from 'react';
import { LeaveBalanceCards } from '../components/my-requests/LeaveBalanceCards';
import { RequestHistoryTable } from '../components/my-requests/RequestHistoryTable';
import { LeaveBalance, LeaveRequest } from '../types';

// Mock data for leave balances
const mockLeaveBalances: LeaveBalance[] = [
  { type: 'Annual Leave', total: 15, used: 5, remaining: 10 },
  { type: 'Sick Leave', total: 10, used: 2, remaining: 8 },
  { type: 'Parental Leave', total: 14, used: 0, remaining: 14 },
  { type: 'Other Leave', total: 5, used: 1, remaining: 4 },
];

// Mock data for request history
const mockRequests: LeaveRequest[] = [
  {
    id: 'REQ-001',
    type: 'paid-leave',
    startDate: new Date('2025-11-15'),
    endDate: new Date('2025-11-17'),
    duration: 3,
    submittedDate: new Date('2025-10-26'),
    status: 'pending',
  },
  {
    id: 'REQ-002',
    type: 'wfh',
    startDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-01'),
    duration: 1,
    submittedDate: new Date('2025-10-25'),
    status: 'cancelled',
  },
  {
    id: 'REQ-003',
    type: 'wfh',
    startDate: new Date('2025-10-28'),
    endDate: new Date('2025-10-30'),
    duration: 3,
    submittedDate: new Date('2025-10-20'),
    status: 'approved',
  },
  {
    id: 'REQ-004',
    type: 'paid-sick-leave',
    startDate: new Date('2025-10-18'),
    endDate: new Date('2025-10-19'),
    duration: 2,
    submittedDate: new Date('2025-10-18'),
    status: 'approved',
  },
  {
    id: 'REQ-005',
    type: 'paid-leave',
    startDate: new Date('2025-12-24'),
    endDate: new Date('2025-12-26'),
    duration: 3,
    submittedDate: new Date('2025-10-15'),
    status: 'rejected',
  },
  {
    id: 'REQ-006',
    type: 'unpaid-leave',
    startDate: new Date('2025-09-10'),
    endDate: new Date('2025-09-12'),
    duration: 3,
    submittedDate: new Date('2025-09-01'),
    status: 'approved',
  },
  {
    id: 'REQ-007',
    type: 'wfh',
    startDate: new Date('2025-08-15'),
    endDate: new Date('2025-08-15'),
    duration: 1,
    submittedDate: new Date('2025-08-10'),
    status: 'approved',
  },
  {
    id: 'REQ-008',
    type: 'paid-sick-leave',
    startDate: new Date('2025-07-22'),
    endDate: new Date('2025-07-23'),
    duration: 2,
    submittedDate: new Date('2025-07-22'),
    status: 'approved',
  },
  {
    id: 'REQ-009',
    type: 'paid-leave',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-05'),
    duration: 5,
    submittedDate: new Date('2025-05-15'),
    status: 'approved',
  },
  {
    id: 'REQ-010',
    type: 'wfh',
    startDate: new Date('2025-05-10'),
    endDate: new Date('2025-05-12'),
    duration: 3,
    submittedDate: new Date('2025-05-05'),
    status: 'approved',
  },
  {
    id: 'REQ-011',
    type: 'unpaid-sick-leave',
    startDate: new Date('2025-04-18'),
    endDate: new Date('2025-04-20'),
    duration: 3,
    submittedDate: new Date('2025-04-18'),
    status: 'approved',
  },
  {
    id: 'REQ-012',
    type: 'paid-leave',
    startDate: new Date('2025-03-25'),
    endDate: new Date('2025-03-28'),
    duration: 4,
    submittedDate: new Date('2025-03-10'),
    status: 'rejected',
  },
];

export default function MyRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockRequests);

  const handleViewRequest = (request: LeaveRequest) => {
    // TODO: Open a modal or navigate to detail page
    console.log('View request:', request);
  };

  const handleCancelRequest = (request: LeaveRequest) => {
    // Update the request status to cancelled
    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id ? { ...r, status: 'cancelled' as const } : r,
      ),
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* Leave Balance Section */}
      <LeaveBalanceCards balances={mockLeaveBalances} />
      {/* Request History Section */}
      <RequestHistoryTable
        requests={requests}
        onView={handleViewRequest}
        onCancel={handleCancelRequest}
      />
    </div>
  );
}
