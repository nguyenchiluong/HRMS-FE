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
import { format, parseISO } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, Clock, Eye, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import type { ApprovalStatus, TimesheetApprovalRequest } from '../../types';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TimesheetApprovalTableProps {
  requests: TimesheetApprovalRequest[];
  pagination: Pagination;
  isLoading: boolean;
  isApproving: boolean;
  isRejecting: boolean;
  onApprove: (request: TimesheetApprovalRequest, comment?: string) => void;
  onReject: (request: TimesheetApprovalRequest, reason: string) => void;
  onPageChange: (page: number) => void;
}

const getStatusConfig = (status: ApprovalStatus) => {
  switch (status) {
    case 'APPROVED':
      return {
        label: 'Approved',
        className: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      };
    case 'PENDING':
      return {
        label: 'Pending',
        className: 'bg-amber-100 text-amber-700 border border-amber-200',
      };
    case 'REJECTED':
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

const getMonthName = (month: number) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month - 1] || months[month]; // Handle 0-based and 1-based
};

export const TimesheetApprovalTable: React.FC<TimesheetApprovalTableProps> = ({
  requests,
  pagination,
  isLoading,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
  onPageChange,
}) => {
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<TimesheetApprovalRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view'>(
    'view',
  );
  const [notes, setNotes] = useState('');

  const { page, total, totalPages, limit } = pagination;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  const isSubmitting = isApproving || isRejecting;

  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handlePageClick = (pageNum: number) => {
    onPageChange(pageNum);
  };

  const handleActionClick = (
    request: TimesheetApprovalRequest,
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
      setActionDialogOpen(false);
      setSelectedRequest(null);
      setNotes('');
    } else if (actionType === 'reject') {
      if (!notes.trim()) return;
      onReject(selectedRequest, notes);
      setActionDialogOpen(false);
      setSelectedRequest(null);
      setNotes('');
    }
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
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
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
          page - 1,
          page,
          page + 1,
          '...',
          totalPages,
        );
      }
    }
    return pages;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatWeekPeriod = (request: TimesheetApprovalRequest) => {
    try {
      const start = format(parseISO(request.weekStartDate), 'MMM dd');
      const end = format(parseISO(request.weekEndDate), 'MMM dd, yyyy');
      return `Week ${request.weekNumber}: ${start} - ${end}`;
    } catch {
      return `Week ${request.weekNumber}`;
    }
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
                Period
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Total Hours
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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  No timesheet requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => {
                const statusConfig = getStatusConfig(request.status);
                const isPending = request.status === 'PENDING';

                return (
                  <tr key={request.requestId} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-normal text-white">
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
                      <div className="text-sm font-medium text-gray-900">
                        {getMonthName(request.month)} {request.year}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatWeekPeriod(request)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {request.summary.totalHours}h
                      </div>
                      <div className="text-xs text-gray-500">
                        {request.summary.regularHours}h regular • {request.summary.overtimeHours}h
                        OT
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-xs text-gray-600">
                      {formatDate(request.submittedAt)}
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
                              disabled={isSubmitting}
                              className="h-8 w-8 border-emerald-200 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActionClick(request, 'reject')}
                              disabled={isSubmitting}
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
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-white px-6 py-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {endIndex} of {total} results
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((pageNum, index) =>
                typeof pageNum === 'number' ? (
                  <Button
                    key={index}
                    variant={page === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageClick(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum}
                  </Button>
                ) : (
                  <span key={index} className="px-2 text-gray-400">
                    {pageNum}
                  </span>
                ),
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page === totalPages}
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
                  Timesheet Details
                </>
              )}
              {actionType === 'approve' && (
                <>
                  <Check className="h-5 w-5 text-emerald-600" />
                  Approve Timesheet
                </>
              )}
              {actionType === 'reject' && (
                <>
                  <X className="h-5 w-5 text-red-600" />
                  Reject Timesheet
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
                  <div className="text-gray-500">Period:</div>
                  <div className="font-medium">
                    {getMonthName(selectedRequest.month)} {selectedRequest.year}
                  </div>
                  <div className="text-gray-500">Week:</div>
                  <div className="font-medium">
                    {formatWeekPeriod(selectedRequest)}
                  </div>
                  <div className="text-gray-500">Total Hours:</div>
                  <div className="font-medium">
                    {selectedRequest.summary.totalHours}h
                  </div>
                  <div className="text-gray-500">Regular Hours:</div>
                  <div className="font-medium">
                    {selectedRequest.summary.regularHours}h
                  </div>
                  <div className="text-gray-500">Overtime:</div>
                  <div className="font-medium">
                    {selectedRequest.summary.overtimeHours}h
                  </div>
                  <div className="text-gray-500">Leave Hours:</div>
                  <div className="font-medium">
                    {selectedRequest.summary.leaveHours}h
                  </div>
                  <div className="text-gray-500">Submitted:</div>
                  <div className="font-medium">
                    {formatDate(selectedRequest.submittedAt)}
                  </div>
                </div>
              </div>

              {(actionType === 'approve' || actionType === 'reject') && (
                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {actionType === 'reject'
                      ? 'Reason for rejection *'
                      : 'Comments (optional)'}
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      actionType === 'reject'
                        ? 'Please provide a reason for rejection...'
                        : 'Add any comments...'
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
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isApproving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve
              </Button>
            )}
            {actionType === 'reject' && (
              <Button
                onClick={handleConfirmAction}
                disabled={!notes.trim() || isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isRejecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                Reject
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
