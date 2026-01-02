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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { FileUploadSection } from './FileUploadSection';
import { ImportantNotice } from './ImportantNotice';
import { RequestTypeSelect } from './RequestTypeSelect';
import { RequestType } from '../../types';

interface SubmitTimeOffRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    selectedType: RequestType | null;
    startDate: Date | undefined;
    endDate: Date | undefined;
    reason: string;
    emergencyContact: string;
    attachments: File[];
  }) => void;
}

export const SubmitTimeOffRequestModal: React.FC<
  SubmitTimeOffRequestModalProps
> = ({ open, onOpenChange, onSubmit }) => {
  const [selectedType, setSelectedType] = useState<RequestType | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        selectedType,
        startDate,
        endDate,
        reason,
        emergencyContact,
        attachments,
      });
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    onOpenChange(false);
    // Reset form
    setSelectedType(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setReason('');
    setEmergencyContact('');
    setAttachments([]);
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
                  placeholder="Provide a detailed reason for your request..."
                  rows={4}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">
                  Emergency Contact (Optional)
                </Label>
                <Input
                  id="emergencyContact"
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Phone number or email for emergencies"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                />
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
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg">
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

