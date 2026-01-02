import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  File,
  HeartPulse,
  Home,
  Palmtree,
  Paperclip,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { LeaveRequest, LeaveRequestStatus, RequestType } from '../../types';

interface RequestHistoryTableProps {
  requests: LeaveRequest[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onCancel: (request: { id: string }) => void;
  onPageChange?: (page: number) => void;
}

const getRequestTypeConfig = (type: RequestType) => {
  switch (type) {
    case 'PAID_LEAVE':
      return {
        label: 'Paid Leave',
        icon: <Palmtree className="h-4 w-4 text-blue-500" />,
      };
    case 'UNPAID_LEAVE':
      return {
        label: 'Unpaid Leave',
        icon: <Palmtree className="h-4 w-4 text-gray-500" />,
      };
    case 'PAID_SICK_LEAVE':
      return {
        label: 'Paid Sick Leave',
        icon: <HeartPulse className="h-4 w-4 text-red-500" />,
      };
    case 'UNPAID_SICK_LEAVE':
      return {
        label: 'Unpaid Sick Leave',
        icon: <HeartPulse className="h-4 w-4 text-gray-500" />,
      };
    case 'WFH':
      return {
        label: 'Work From Home',
        icon: <Home className="h-4 w-4 text-green-500" />,
      };
    // Legacy support for kebab-case (during migration)
    case 'paid-leave':
      return {
        label: 'Paid Leave',
        icon: <Palmtree className="h-4 w-4 text-blue-500" />,
      };
    case 'unpaid-leave':
      return {
        label: 'Unpaid Leave',
        icon: <Palmtree className="h-4 w-4 text-gray-500" />,
      };
    case 'paid-sick-leave':
      return {
        label: 'Paid Sick Leave',
        icon: <HeartPulse className="h-4 w-4 text-red-500" />,
      };
    case 'unpaid-sick-leave':
      return {
        label: 'Unpaid Sick Leave',
        icon: <HeartPulse className="h-4 w-4 text-gray-500" />,
      };
    case 'wfh':
      return {
        label: 'Work From Home',
        icon: <Home className="h-4 w-4 text-green-500" />,
      };
    default:
      return {
        label: type,
        icon: <Palmtree className="h-4 w-4 text-gray-500" />,
      };
  }
};

const getStatusConfig = (status: LeaveRequestStatus) => {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        icon: <CheckCircle className="h-4 w-4" />,
        className: 'bg-gray-900 text-white',
      };
    case 'pending':
      return {
        label: 'Pending',
        icon: <Clock className="h-4 w-4" />,
        className: 'bg-white text-gray-700 border border-gray-300',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        icon: <XCircle className="h-4 w-4" />,
        className: 'bg-red-100 text-red-700 border border-red-200',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        icon: <Ban className="h-4 w-4" />,
        className: 'bg-white text-gray-500 border border-gray-300',
      };
    default:
      return {
        label: status,
        icon: <Clock className="h-4 w-4" />,
        className: 'bg-gray-100 text-gray-700',
      };
  }
};

export const RequestHistoryTable: React.FC<RequestHistoryTableProps> = ({
  requests,
  pagination,
  onCancel,
  onPageChange,
}) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<LeaveRequest | null>(
    null,
  );

  // Use pagination from API if available, otherwise use client-side pagination
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || requests.length;
  const startIndex = pagination
    ? (currentPage - 1) * pagination.limit
    : 0;
  const endIndex = pagination
    ? startIndex + requests.length
    : requests.length;
  const currentRequests = requests;

  const handlePreviousPage = () => {
    const newPage = Math.max(currentPage - 1, 1);
    onPageChange?.(newPage);
  };

  const handleNextPage = () => {
    const newPage = Math.min(currentPage + 1, totalPages);
    onPageChange?.(newPage);
  };

  const handlePageClick = (page: number) => {
    onPageChange?.(page);
  };

  const handleCancelClick = (request: LeaveRequest) => {
    setRequestToCancel(request);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      onCancel({ id: requestToCancel.id });
      setCancelDialogOpen(false);
      setRequestToCancel(null);
    }
  };

  const handleCloseDialog = () => {
    setCancelDialogOpen(false);
    setRequestToCancel(null);
  };

  // Generate page numbers to display
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
      <h2 className="font-regular text-md mb-4 text-gray-900">
        Request History
      </h2>
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Request ID
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
                Attachments
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentRequests.map((request) => {
              const typeConfig = getRequestTypeConfig(request.type);
              const statusConfig = getStatusConfig(request.status);
              const canCancel = request.status === 'pending';

              return (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-600">
                    {request.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-900">
                        {typeConfig.label}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-xs text-gray-900">
                      {format(request.startDate, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      to {format(request.endDate, 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-xs text-gray-600">
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
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {request.attachments && request.attachments.length > 0 ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1.5 text-xs text-gray-600 hover:text-gray-900"
                            >
                              <Paperclip className="h-3.5 w-3.5" />
                              <span className="font-medium">
                                {request.attachments.length}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" align="center">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 border-b pb-2">
                                <Paperclip className="h-4 w-4 text-gray-500" />
                                <h4 className="text-sm font-semibold">
                                  Attachments ({request.attachments.length})
                                </h4>
                              </div>
                              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                                {request.attachments.map((url, index) => {
                                  const fileName =
                                    url.split('/').pop() || `attachment-${index + 1}`;
                                  const fileExtension =
                                    fileName.split('.').pop()?.toLowerCase() || '';

                                  return (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 text-xs transition-colors hover:bg-gray-50 hover:border-gray-300"
                                      download
                                    >
                                      <File className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                      <span className="flex-1 truncate text-gray-700">
                                        {fileName}
                                      </span>
                                      <Download className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {canCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelClick(request)}
                          className="gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Ban className="h-4 w-4" />
                          Cancel
                        </Button>
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
            No requests found
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-white px-6 py-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total}{' '}
              results
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

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Cancel Request
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel this request?
            </p>
            {requestToCancel && (
              <div className="mt-4 rounded-lg border bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Request ID:</div>
                  <div className="font-medium">{requestToCancel.id}</div>
                  <div className="text-gray-500">Type:</div>
                  <div className="font-medium">
                    {getRequestTypeConfig(requestToCancel.type).label}
                  </div>
                  <div className="text-gray-500">Period:</div>
                  <div className="font-medium">
                    {format(requestToCancel.startDate, 'MMM dd, yyyy')} -{' '}
                    {format(requestToCancel.endDate, 'MMM dd, yyyy')}
                  </div>
                  <div className="text-gray-500">Duration:</div>
                  <div className="font-medium">
                    {requestToCancel.duration}{' '}
                    {requestToCancel.duration === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>
            )}
            <p className="mt-4 text-xs text-gray-500">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseDialog}>
              No, Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
