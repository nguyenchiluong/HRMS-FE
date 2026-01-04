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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Eye, Info, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  useCancelIdChangeRequest,
  useIdChangeRequests,
} from '../../hooks/useIdChangeRequests';
import type { IdChangeRequestDto } from '../../api/idChangeRequests';

// Map API status to display status
type DisplayStatus = 'Approved' | 'Rejected' | 'Pending' | 'Cancelled';

const mapApiStatusToDisplay = (
  status: string,
): DisplayStatus => {
  switch (status.toUpperCase()) {
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    case 'PENDING':
      return 'Pending';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return 'Pending';
  }
};

// Format date for display
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

// Convert API DTO to display format
const convertToDisplayRequest = (
  apiRequest: IdChangeRequestDto,
): {
  id: string;
  fieldChanges: string[];
  fieldChangeDetails?: Array<{
    fieldLabel: string;
    oldValue: string | null;
    newValue: string | null;
  }>;
  requestDate: string;
  status: DisplayStatus;
  notes?: string;
  reason?: string;
  attachments?: string[];
} => {
  return {
    id: apiRequest.id,
    fieldChanges: apiRequest.fieldChanges || [],
    fieldChangeDetails: apiRequest.fieldChangeDetails,
    requestDate: formatDate(apiRequest.submittedDate),
    status: mapApiStatusToDisplay(apiRequest.status),
    notes:
      apiRequest.rejectionReason ||
      apiRequest.approvalComment ||
      undefined,
    reason: apiRequest.reason,
    attachments: apiRequest.attachments,
  };
};

const getStatusColor = (status: DisplayStatus) => {
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

const getActionForStatus = (status: DisplayStatus): string | null => {
  switch (status) {
    case 'Pending':
      return 'Cancel';
    case 'Approved':
    case 'Rejected':
    case 'Cancelled':
    default:
      return null;
  }
};

export default function ChangeRequestsHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReturnType<
    typeof convertToDisplayRequest
  > | null>(null);

  const {
    data: requestsData,
    isLoading,
    isError,
  } = useIdChangeRequests({
    page: currentPage,
    limit: 10,
  });

  const cancelRequestMutation = useCancelIdChangeRequest();

  // Convert API data to display format
  const changeRequests = useMemo(() => {
    if (!requestsData?.data) return [];
    return requestsData.data.map(convertToDisplayRequest);
  }, [requestsData]);

  const totalPages = requestsData?.pagination.totalPages || 1;

  const handleActionClick = (
    request: ReturnType<typeof convertToDisplayRequest>,
  ) => {
    setSelectedRequest(request);
    setCancelDialogOpen(true);
  };

  const handleViewDetails = (
    request: ReturnType<typeof convertToDisplayRequest>,
  ) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedRequest) return;

    cancelRequestMutation.mutate(
      {
        requestId: selectedRequest.id,
      },
      {
        onSuccess: () => {
          setCancelDialogOpen(false);
          setSelectedRequest(null);
        },
      },
    );
  };

  const handleCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedRequest(null);
  };

  if (isLoading) {
    return (
      <Card className="flex w-full flex-col p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900">
            Change Requests History
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="flex w-full flex-col p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900">
            Change Requests History
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-red-500">Error loading change requests</p>
          <p className="text-sm text-gray-600">
            Please try refreshing the page
          </p>
        </div>
      </Card>
    );
  }

  // Check if there are any pending requests
  const hasPendingRequests = useMemo(() => {
    return changeRequests.some((req) => req.status === 'Pending');
  }, [changeRequests]);

  return (
    <>
      <Card className="flex w-full flex-col p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900">
            Change Requests History
          </h2>
        </div>

        <div className="space-y-4">
          {/* Info Alert for Pending Requests */}
          {hasPendingRequests && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                You have pending requests that are currently being reviewed by
                administrators. Please wait for approval. You will be notified
                once a decision has been made.
              </AlertDescription>
            </Alert>
          )}

          {changeRequests.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-600">No change requests found</p>
            </div>
          ) : (
            <>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="flex items-center gap-8 rounded-t-lg border-b border-gray-200 bg-gray-50 px-4 py-3">
                <div className="w-[280px] text-sm font-medium text-gray-900">
                  Fields Changed
                </div>
                <div className="w-[135px] text-sm font-medium text-gray-900">
                  Request Date
                </div>
                <div className="w-[110px] text-sm font-medium text-gray-900">
                  Status
                </div>
                <div className="w-[120px] text-sm font-medium text-gray-900">
                  Actions
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
                      'flex items-start gap-8 border-b border-gray-100 px-4 py-3 last:border-0',
                      index % 2 === 1 ? 'bg-gray-50' : 'bg-white',
                    )}
                  >
                    <div className="w-[280px] text-sm text-gray-700">
                      <div className="flex flex-wrap gap-1.5">
                        {request.fieldChanges.length === 0 ? (
                          <span className="text-gray-400">No fields</span>
                        ) : request.fieldChanges.length <= 2 ? (
                          request.fieldChanges.map((field, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                            >
                              {field}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                              {request.fieldChanges[0]}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                              +{request.fieldChanges.length - 1} more
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-[135px] pt-0.5 text-sm text-gray-700">
                      {request.requestDate}
                    </div>
                    <div
                      className={cn(
                        'w-[110px] pt-0.5 text-sm font-medium',
                        getStatusColor(request.status),
                      )}
                    >
                      {request.status}
                    </div>
                    <div className="w-[120px] pt-0.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewDetails(request)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                        {action && (
                          <Button
                            variant="link"
                            className="h-auto p-0 text-primary underline hover:text-primary/80"
                            onClick={() => handleActionClick(request)}
                          >
                            {action}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 pt-0.5 text-sm text-gray-700">
                      {request.notes || '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'outline' : 'ghost'}
                          size="sm"
                          className="h-10 w-10 text-sm font-medium"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-gray-600" />
              Request Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this change request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              {/* Request Info */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Request Date</div>
                    <div className="mt-1 font-medium text-gray-900">
                      {selectedRequest.requestDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div
                      className={cn(
                        'mt-1 font-medium',
                        getStatusColor(selectedRequest.status),
                      )}
                    >
                      {selectedRequest.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Status Note */}
              {selectedRequest.status === 'Pending' && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Info className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-sm text-yellow-800">
                    This request is currently being reviewed by administrators.
                    Please wait for approval. You will be notified once a
                    decision has been made.
                  </AlertDescription>
                </Alert>
              )}

              {/* Field Changes Details */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Field Changes
                </h3>
                <div className="space-y-4">
                  {selectedRequest.fieldChangeDetails &&
                  selectedRequest.fieldChangeDetails.length > 0 ? (
                    selectedRequest.fieldChangeDetails.map((detail, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="text-xs font-medium text-gray-700">
                          {detail.fieldLabel}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-gray-500">Old Value</div>
                            <div className="mt-1 rounded border bg-white p-2 text-sm text-gray-700">
                              {detail.oldValue || '—'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">New Value</div>
                            <div className="mt-1 rounded border bg-emerald-50 p-2 text-sm font-medium text-emerald-700">
                              {detail.newValue || '—'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      No detailed change information available
                    </div>
                  )}
                </div>
              </div>

              {/* Reason */}
              {selectedRequest.reason && (
                <div className="rounded-lg border bg-blue-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">
                    Your Reason
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedRequest.reason}
                  </p>
                </div>
              )}

              {/* Notes (Admin notes for rejected requests) */}
              {selectedRequest.notes && (
                <div className="rounded-lg border bg-amber-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">
                    Admin Notes
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}

              {/* Attachments */}
              {selectedRequest.attachments &&
                selectedRequest.attachments.length > 0 && (
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {selectedRequest.attachments.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-primary hover:underline"
                        >
                          {url.split('/').pop() || `Attachment ${idx + 1}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseViewDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this change request? The status
              will be updated to &quot;Cancelled&quot;.
              {selectedRequest && (
                <div className="mt-4 rounded-lg border bg-gray-50 p-4">
                  <div className="flex flex-col gap-4 text-sm">
                    <div>
                      <div className="mb-2 font-medium text-gray-900">
                        Fields Changed:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedRequest.fieldChanges.map((field, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-gray-600">
                      Request Date: {selectedRequest.requestDate}
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Confirm Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
