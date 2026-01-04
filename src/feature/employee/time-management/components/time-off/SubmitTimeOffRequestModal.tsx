import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUploadFiles } from '@/hooks/useFileUpload';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSubmitTimeOffRequest } from '../../hooks';
import { RequestType } from '../../types';
import { DateRangePicker } from './DateRangePicker';
import { FileUploadSection } from './FileUploadSection';
import { ImportantNotice } from './ImportantNotice';
import { RequestTypeSelect } from './RequestTypeSelect';

interface SubmitTimeOffRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const SubmitTimeOffRequestModal: React.FC<
  SubmitTimeOffRequestModalProps
> = ({ open, onOpenChange, onSuccess }) => {
  const [selectedType, setSelectedType] = useState<RequestType | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const submitMutation = useSubmitTimeOffRequest();
  const uploadFilesMutation = useUploadFiles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedType) {
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    if (reason.trim().length < 10) {
      return;
    }

    // Check if sick leave > 3 days requires attachments
    const isSickLeave =
      selectedType === 'PAID_SICK_LEAVE' || selectedType === 'UNPAID_SICK_LEAVE';
    const duration =
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (isSickLeave && duration > 3 && attachments.length === 0) {
      // Show error message
      toast.error('Medical certificate is required for sick leave requests longer than 3 days.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Format dates as ISO date strings (yyyy-MM-dd) - use local timezone
      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      // 1. Upload files to S3 first if there are any
      let attachmentUrls: string[] | undefined;
      if (attachments.length > 0) {
        setUploadProgress(`Uploading ${attachments.length} file(s)...`);
        try {
          attachmentUrls = await uploadFilesMutation.mutateAsync(attachments);
          setUploadProgress('');
        } catch (uploadError) {
          setUploadProgress('');
          setIsSubmitting(false);
          // Error is already handled by the mutation hook
          return;
        }
      }

      // 2. Submit the time-off request with file URLs
      await submitMutation.mutateAsync({
        type: selectedType,
        startDate: startDateStr,
        endDate: endDateStr,
        reason: reason.trim(),
        attachments: attachmentUrls,
      });

      handleCloseModal();
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to submit time-off request:', error);
      setUploadProgress('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    onOpenChange(false);
    // Reset form
    setSelectedType(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setReason('');
    setAttachments([]);
    setIsSubmitting(false);
    setUploadProgress('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Time Off Request</DialogTitle>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardDescription className="text-[12px]">
              Request time off or work from home. Your manager will review and
              approve your request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Request Type */}
              <RequestTypeSelect
                value={selectedType}
                onChange={setSelectedType}
              />

              {/* Date Range */}
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />

              {/* Reason / Description */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="font-regular text-sm">
                  Reason / Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide a detailed reason for your request (minimum 10 characters)..."
                  rows={4}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  minLength={10}
                />
                {reason.length > 0 && reason.length < 10 && (
                  <p className="text-xs text-red-500">
                    Reason must be at least 10 characters ({reason.length}/10)
                  </p>
                )}
              </div>

              {/* Supporting Documents */}
              <FileUploadSection
                files={attachments}
                onFilesChange={setAttachments}
              />

              {/* Important Notice */}
              <ImportantNotice message="Sick leave exceeding 3 days requires medical certificate. Your request will be reviewed by your manager." />

              {/* Submit Button */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={
                    isSubmitting ||
                    !selectedType ||
                    !startDate ||
                    !endDate ||
                    reason.trim().length < 10
                  }
                >
                  {isSubmitting
                    ? uploadProgress || 'Submitting...'
                    : 'Submit Request'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

