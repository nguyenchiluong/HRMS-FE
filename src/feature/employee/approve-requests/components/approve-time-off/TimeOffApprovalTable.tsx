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
  HeartPulse,
  Home,
  Palmtree,
  X,
} from 'lucide-react';
import { useState } from 'react';
import {
  ApprovalStatus,
  TimeOffApprovalRequest,
  TimeOffType,
} from '../../types';

const ITEMS_PER_PAGE = 10;

interface TimeOffApprovalTableProps {
  requests: TimeOffApprovalRequest[];
  onApprove: (request: TimeOffApprovalRequest, notes?: string) => void;
  onReject: (request: TimeOffApprovalRequest, notes: string) => void;
}

const getTimeOffTypeConfig = (type: TimeOffType) => {
  switch (type) {
    case 'paid-leave':
      return {
        label: 'Paid Leave',
        icon: <Palmtree className="h-4 w-4 text-blue-500" />,
        className: 'bg-blue-50 text-blue-700',
      };
    case 'unpaid-leave':
      return {
        label: 'Unpaid Leave',
        icon: <Palmtree className="h-4 w-4 text-gray-500" />,
        className: 'bg-gray-50 text-gray-700',
      };
    case 'paid-sick-leave':
      return {
        label: 'Paid Sick Leave',
        icon: <HeartPulse className="h-4 w-4 text-red-500" />,
        className: 'bg-red-50 text-red-700',
      };
    case 'unpaid-sick-leave':
      return {
        label: 'Unpaid Sick Leave',
        icon: <HeartPulse className="h-4 w-4 text-gray-500" />,
        className: 'bg-gray-50 text-gray-700',
      };
    case 'wfh':
      return {
        label: 'Work From Home',
        icon: <Home className="h-4 w-4 text-green-500" />,
        className: 'bg-green-50 text-green-700',
      };
    default:
      return {
        label: type,
        icon: <Palmtree className="h-4 w-4 text-gray-500" />,
        className: 'bg-gray-50 text-gray-700',
      };
  }
};

const getStatusConfig = (status: ApprovalStatus) => {
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

export const TimeOffApprovalTable: React.FC<TimeOffApprovalTableProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<TimeOffApprovalRequest | null>(null);
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
    request: TimeOffApprovalRequest,
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
      if (!notes.trim()) return;
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
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Period
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Duration
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Submitted
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
              const typeConfig = getTimeOffTypeConfig(request.type);
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
                        <div className="text-sm font-medium text-gray-900">
                          {request.employeeName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
                        typeConfig.className,
                      )}
                    >
                      {typeConfig.icon}
                      {typeConfig.label}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {format(request.startDate, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-gray-500">
                      to {format(request.endDate, 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-600">
                    {request.duration} {request.duration === 1 ? 'day' : 'days'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-xs text-gray-600">
                    {format(request.submittedDate, 'MMM dd, yyyy')}
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
            No time-off requests found
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'view' && (
                <>
                  <Eye className="h-5 w-5 text-slate-600" />
                  Time-off Request Details
                </>
              )}
              {actionType === 'approve' && (
                <>
                  <Check className="h-5 w-5 text-emerald-600" />
                  Approve Time-off Request
                </>
              )}
              {actionType === 'reject' && (
                <>
                  <X className="h-5 w-5 text-red-600" />
                  Reject Time-off Request
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-4">
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-gray-500">Employee:</div>
                  <div className="font-medium">
                    {selectedRequest.employeeName}
                  </div>
                  <div className="text-gray-500">Department:</div>
                  <div className="font-medium">
                    {selectedRequest.department}
                  </div>
                  <div className="text-gray-500">Type:</div>
                  <div className="font-medium">
                    {getTimeOffTypeConfig(selectedRequest.type).label}
                  </div>
                  <div className="text-gray-500">Period:</div>
                  <div className="font-medium">
                    {format(selectedRequest.startDate, 'MMM dd, yyyy')} -{' '}
                    {format(selectedRequest.endDate, 'MMM dd, yyyy')}
                  </div>
                  <div className="text-gray-500">Duration:</div>
                  <div className="font-medium">
                    {selectedRequest.duration}{' '}
                    {selectedRequest.duration === 1 ? 'day' : 'days'}
                  </div>
                  <div className="text-gray-500">Submitted:</div>
                  <div className="font-medium">
                    {format(selectedRequest.submittedDate, 'MMM dd, yyyy')}
                  </div>
                </div>

                {selectedRequest.reason && (
                  <div className="mt-4 border-t pt-4">
                    <div className="text-sm text-gray-500">Reason:</div>
                    <div className="mt-1 text-sm">{selectedRequest.reason}</div>
                  </div>
                )}
              </div>

              {(actionType === 'approve' || actionType === 'reject') && (
                <div className="mt-4 space-y-2">
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
