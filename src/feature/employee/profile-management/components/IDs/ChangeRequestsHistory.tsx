import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ChangeRequest {
  id: number;
  fieldChange: string;
  requestDate: string;
  status: 'Approved' | 'Rejected' | 'Pending' | 'Cancelled';
  action?: string;
  notes?: string;
}

const initialChangeRequests: ChangeRequest[] = [
  {
    id: 1,
    fieldChange: 'Legal Full Name',
    requestDate: '17/09/2025',
    status: 'Approved',
  },
  {
    id: 2,
    fieldChange: 'Social Insurance Number ID',
    requestDate: '17/09/2025',
    status: 'Approved',
  },
  {
    id: 3,
    fieldChange: 'Legal Full Name',
    requestDate: '17/09/2025',
    status: 'Rejected',
    notes: 'Lack of legal attached documents',
  },
  {
    id: 4,
    fieldChange: 'Social Insurance Number ID',
    requestDate: '17/09/2025',
    status: 'Approved',
  },
  {
    id: 5,
    fieldChange: 'Legal Full Name',
    requestDate: '17/09/2025',
    status: 'Approved',
  },
  {
    id: 6,
    fieldChange: 'Social Insurance Number ID',
    requestDate: '17/09/2025',
    status: 'Pending',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'text-green-600';
    case 'Rejected':
      return 'text-red-600';
    case 'Pending':
      return 'text-yellow-600';
    case 'Cancelled':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

const getActionForStatus = (status: string): string | null => {
  switch (status) {
    case 'Pending':
      return 'Cancel';
    case 'Rejected':
      return 'Resubmit';
    case 'Approved':
    case 'Cancelled':
    default:
      return null;
  }
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ChangeRequestsHistory() {
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(
    initialChangeRequests,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'cancel' | 'resubmit' | null>(
    null,
  );
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(
    null,
  );

  const handleActionClick = (
    request: ChangeRequest,
    action: 'cancel' | 'resubmit',
  ) => {
    setSelectedRequest(request);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedRequest || !actionType) return;

    if (actionType === 'cancel') {
      // Update status to Cancelled
      setChangeRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? { ...req, status: 'Cancelled' as const }
            : req,
        ),
      );
    } else if (actionType === 'resubmit') {
      // Add a new request with Pending status at the top of the list
      const newRequest: ChangeRequest = {
        id: Math.max(...changeRequests.map((r) => r.id)) + 1,
        fieldChange: selectedRequest.fieldChange,
        requestDate: formatDate(new Date()),
        status: 'Pending',
      };
      setChangeRequests((prev) => [newRequest, ...prev]);
    }

    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
  };

  return (
    <>
      <Card className="flex w-full flex-col p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900">
            Change Requests History
          </h2>
        </div>

        <div className="space-y-4">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="flex items-center gap-8 rounded-t-lg border-b border-gray-200 bg-gray-50 px-4 py-3">
                <div className="w-[250px] text-sm font-medium text-gray-900">
                  Field Change
                </div>
                <div className="w-[135px] text-sm font-medium text-gray-900">
                  Request Date
                </div>
                <div className="w-[110px] text-sm font-medium text-gray-900">
                  Status
                </div>
                <div className="w-[70px] text-sm font-medium text-gray-900">
                  Action
                </div>
                <div className="flex-1 text-sm font-medium text-gray-900">
                  Notes
                </div>
              </div>

              {/* Table Rows */}
              {changeRequests.map((request, index) => {
                const action = getActionForStatus(request.status);
                return (
                  <div
                    key={request.id}
                    className={cn(
                      'flex items-center gap-8 border-b border-gray-100 px-4 py-3 last:border-0',
                      index % 2 === 1 ? 'bg-gray-50' : 'bg-white',
                    )}
                  >
                    <div className="w-[250px] text-sm text-gray-700">
                      {request.fieldChange}
                    </div>
                    <div className="w-[135px] text-sm text-gray-700">
                      {request.requestDate}
                    </div>
                    <div
                      className={cn(
                        'w-[110px] text-sm font-medium',
                        getStatusColor(request.status),
                      )}
                    >
                      {request.status}
                    </div>
                    <div className="w-[70px] text-sm">
                      {action && (
                        <Button
                          variant="link"
                          className="h-auto p-0 text-primary underline hover:text-primary/80"
                          onClick={() =>
                            handleActionClick(
                              request,
                              action === 'Cancel' ? 'cancel' : 'resubmit',
                            )
                          }
                        >
                          {action}
                        </Button>
                      )}
                    </div>
                    <div className="flex-1 text-sm text-gray-700">
                      {request.notes || '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-4">
            <Button variant="ghost" size="sm" className="text-sm">
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 text-sm font-medium"
              >
                1
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 text-sm">
                2
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 text-sm">
                3
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 text-sm">
                4
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="text-sm">
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'cancel' ? 'Cancel Request' : 'Resubmit Request'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'cancel' ? (
                <>
                  Are you sure you want to cancel this change request? The
                  status will be updated to &quot;Cancelled&quot;.
                  {selectedRequest && (
                    <div className="mt-4 rounded-lg border bg-gray-50 p-4">
                      <div className="flex flex-col gap-4 text-sm">
                        <div className="font-regular text-gray-900">
                          Field: {selectedRequest.fieldChange}
                        </div>
                        <div className="text-gray-600">
                          Date: {selectedRequest.requestDate}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  Are you sure you want to resubmit this change request? A new
                  request will be created with &quot;Pending&quot; status.
                  {selectedRequest && (
                    <div className="mt-4 rounded-lg border bg-gray-50 p-4">
                      <div className="flex flex-col gap-4 text-sm">
                        <div className="font-regular text-gray-900">
                          Field: {selectedRequest.fieldChange}
                        </div>
                        <div className="text-gray-600">
                          Original Date: {selectedRequest.requestDate}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {actionType === 'cancel' ? 'Confirm Cancel' : 'Confirm Resubmit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
