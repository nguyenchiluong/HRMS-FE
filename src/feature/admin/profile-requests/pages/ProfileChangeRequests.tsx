import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ProfileChangeRequestTable } from '../components/ProfileChangeRequestTable';
import {
  ChangeableField,
  ProfileChangeRequest,
  ProfileRequestStatus,
} from '../types';

// Mock data for demonstration
const generateMockProfileRequests = (): ProfileChangeRequest[] => {
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

  const fieldConfigs: {
    field: ChangeableField;
    label: string;
    oldValue: string;
    newValue: string;
  }[] = [
    {
      field: 'legal-full-name',
      label: 'Legal Full Name',
      oldValue: 'John Doe',
      newValue: 'John Smith',
    },
    {
      field: 'national-id',
      label: 'National ID',
      oldValue: '123456789',
      newValue: '987654321',
    },
    {
      field: 'social-insurance-number',
      label: 'Social Insurance Number',
      oldValue: 'SIN-123456',
      newValue: 'SIN-654321',
    },
    {
      field: 'phone-number',
      label: 'Phone Number',
      oldValue: '+1 234-567-8900',
      newValue: '+1 234-567-8901',
    },
    {
      field: 'personal-email',
      label: 'Personal Email',
      oldValue: 'old.email@example.com',
      newValue: 'new.email@example.com',
    },
    {
      field: 'address',
      label: 'Address',
      oldValue: '123 Old Street, City',
      newValue: '456 New Avenue, City',
    },
    {
      field: 'bank-account',
      label: 'Bank Account',
      oldValue: '****1234',
      newValue: '****5678',
    },
  ];

  const reasons = [
    'Legal name change after marriage',
    'Updated ID document',
    'Moved to new address',
    'Changed phone provider',
    'Updated email for personal use',
    'Bank account closure',
    'Correction of typo in original data',
  ];

  const requests: ProfileChangeRequest[] = [];
  const today = new Date();

  for (let i = 0; i < 20; i++) {
    const requestDate = new Date(today);
    requestDate.setDate(today.getDate() - Math.floor(Math.random() * 30));

    const status = i < 8 ? 'pending' : i < 15 ? 'approved' : 'rejected';

    const fieldConfig = fieldConfigs[i % fieldConfigs.length];

    requests.push({
      id: `PCR-${String(i + 1).padStart(4, '0')}`,
      employeeId: `EMP-${String(i + 1).padStart(4, '0')}`,
      employeeName: names[i % names.length],
      employeeEmail: `${names[i % names.length].toLowerCase().replace(' ', '.')}@company.com`,
      department: departments[i % departments.length],
      field: fieldConfig.field,
      fieldLabel: fieldConfig.label,
      oldValue: fieldConfig.oldValue,
      newValue: fieldConfig.newValue,
      requestDate,
      status: status as 'pending' | 'approved' | 'rejected',
      reason: reasons[i % reasons.length],
      attachments:
        i % 3 === 0 ? [`https://example.com/doc-${i + 1}.pdf`] : undefined,
    });
  }

  return requests;
};

type FilterStatus = 'all' | ProfileRequestStatus;

export default function ProfileChangeRequests() {
  const [requests, setRequests] = useState<ProfileChangeRequest[]>(
    generateMockProfileRequests,
  );
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // Calculate stats
  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  // Filter requests based on selected status
  const filteredRequests =
    filterStatus === 'all'
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  const handleApprove = (request: ProfileChangeRequest, notes?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? { ...r, status: 'approved' as const, adminNotes: notes }
          : r,
      ),
    );
  };

  const handleReject = (request: ProfileChangeRequest, notes: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? { ...r, status: 'rejected' as const, adminNotes: notes }
          : r,
      ),
    );
  };

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
          All ({requests.length})
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
                ({filteredRequests.length} {filterStatus})
              </span>
            )}
          </h2>
        </div>
        <ProfileChangeRequestTable
          requests={filteredRequests}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
