import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useState } from 'react';
import { TimeOffApprovalTable } from '../components/approve-time-off/TimeOffApprovalTable';
import { TimeOffApprovalRequest, TimeOffType } from '../types';

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

    const status = i < 6 ? 'pending' : i < 11 ? 'approved' : 'rejected';

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
      status: status as 'pending' | 'approved' | 'rejected',
    });
  }

  return requests;
};

export default function ApproveTimeOff() {
  const [requests, setRequests] = useState<TimeOffApprovalRequest[]>(
    generateMockTimeOffRequests,
  );

  // Calculate stats
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const handleApprove = (request: TimeOffApprovalRequest, notes?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id ? { ...r, status: 'approved' as const, notes } : r,
      ),
    );
  };

  const handleReject = (request: TimeOffApprovalRequest, notes: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id ? { ...r, status: 'rejected' as const, notes } : r,
      ),
    );
  };

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
          Time-off Requests
        </h2>
        <TimeOffApprovalTable
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
