import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { ProfileChangeRequest, ProfileRequestStatus } from '../types';

const ITEMS_PER_PAGE = 10;

interface ProfileChangeRequestTableProps {
  requests: ProfileChangeRequest[];
  onApprove: (request: ProfileChangeRequest, notes?: string) => void;
  onReject: (request: ProfileChangeRequest, notes: string) => void;
}

const getStatusConfig = (status: ProfileRequestStatus) => {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        className: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      };
    case 'pending':
      return {
        label: 'Pending',
        className: 'bg-amber-100 text-amber-700 border border-amber-200',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        className: 'bg-red-100 text-red-700 border border-red-200',
      };
    default:
      return {
        label: status,
        className: 'bg-gray-100 text-gray-700',
      };
  }
};

export const ProfileChangeRequestTable: React.FC<
  ProfileChangeRequestTableProps
> = ({ requests, onApprove, onReject }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<ProfileChangeRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view'>(
    'view',
  );
  const [notes, setNotes] = useState('');

  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRequests = requests.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleActionClick = (
    request: ProfileChangeRequest,
    action: 'approve' | 'reject' | 'view',
  ) => {
    setSelectedRequest(request);
    setActionType(action);
    setNotes('');
    setActionDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedRequest) return;

    if (actionType === 'approve') {
      onApprove(selectedRequest, notes || undefined);
    } else if (actionType === 'reject') {
      if (!notes.trim()) return; // Require notes for rejection
      onReject(selectedRequest, notes);
    }

    setActionDialogOpen(false);
    setSelectedRequest(null);
    setNotes('');
  };

  const handleCloseDialog = () => {
    setActionDialogOpen(false);
    setSelectedRequest(null);
    setNotes('');
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div>
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Field Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Old Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                New Value
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Request Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentRequests.map((request) => {
              const statusConfig = getStatusConfig(request.status);
              const isPending = request.status === 'pending';

              return (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                        {request.employeeName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">
                          {request.employeeName}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {request.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-gray-900">
                      {request.fieldLabel}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-xs text-gray-600">
                      {request.oldValue || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-xs font-medium text-gray-900">
                      {request.newValue}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-xs text-gray-600">
                    {format(request.requestDate, 'MMM dd, yyyy')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                          statusConfig.className,
                        )}
                      >
                        <Clock className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionClick(request, 'view')}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isPending && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleActionClick(request, 'approve')
                            }
                            className="h-8 w-8 border-emerald-200 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActionClick(request, 'reject')}
                            className="h-8 w-8 border-red-200 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {requests.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No profile change requests found
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-white px-6 py-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, requests.length)}{' '}
              of {requests.length} results
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((page, index) =>
                typeof page === 'number' ? (
                  <Button
                    key={index}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageClick(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                ) : (
                  <span key={index} className="px-2 text-gray-400">
                    {page}
                  </span>
                ),
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'view' && (
                <>
                  <Eye className="h-5 w-5 text-slate-600" />
                  Profile Change Request Details
                </>
              )}
              {actionType === 'approve' && (
                <>
                  <Check className="h-5 w-5 text-emerald-600" />
                  Approve Profile Change Request
                </>
              )}
              {actionType === 'reject' && (
                <>
                  <X className="h-5 w-5 text-red-600" />
                  Reject Profile Change Request
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-4">
              {/* Employee Info */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Employee Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-gray-500">Name:</div>
                  <div className="font-medium">
                    {selectedRequest.employeeName}
                  </div>
                  <div className="text-gray-500">Email:</div>
                  <div className="font-medium">
                    {selectedRequest.employeeEmail}
                  </div>
                  <div className="text-gray-500">Department:</div>
                  <div className="font-medium">
                    {selectedRequest.department}
                  </div>
                  <div className="text-gray-500">Request Date:</div>
                  <div className="font-medium">
                    {format(selectedRequest.requestDate, 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>

              {/* Change Details */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Change Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Field:</div>
                    <div className="mt-1 text-sm font-medium">
                      {selectedRequest.fieldLabel}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Old Value:</div>
                      <div className="mt-1 rounded border bg-white p-2 text-sm text-gray-700">
                        {selectedRequest.oldValue || '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">New Value:</div>
                      <div className="mt-1 rounded border bg-emerald-50 p-2 text-sm font-medium text-emerald-700">
                        {selectedRequest.newValue}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Reason */}
              {selectedRequest.reason && (
                <div className="rounded-lg border bg-blue-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">
                    Employee's Reason
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedRequest.reason}
                  </p>
                </div>
              )}

              {/* Attachments */}
              {selectedRequest.attachments &&
                selectedRequest.attachments.length > 0 && (
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                      Supporting Documents
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.attachments.map(
                        (url: string, index: number) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded border bg-white px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50"
                          >
                            <FileText className="h-3 w-3" />
                            Document {index + 1}
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Admin Notes */}
              {(actionType === 'approve' || actionType === 'reject') && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {actionType === 'reject'
                      ? 'Reason for rejection *'
                      : 'Notes (optional)'}
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      actionType === 'reject'
                        ? 'Please provide a reason for rejection...'
                        : 'Add any notes...'
                    }
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseDialog}>
              {actionType === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {actionType === 'approve' && (
              <Button
                onClick={handleConfirmAction}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            )}
            {actionType === 'reject' && (
              <Button
                onClick={handleConfirmAction}
                disabled={!notes.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
