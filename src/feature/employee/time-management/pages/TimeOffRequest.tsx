import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { DateRangePicker } from '../components/time-off/DateRangePicker';
import { FileUploadSection } from '../components/time-off/FileUploadSection';
import { ImportantNotice } from '../components/time-off/ImportantNotice';
import { RequestTypeSelect } from '../components/time-off/RequestTypeSelect';
import { RequestType } from '../types';

export default function TimeOffRequest() {
  const [selectedType, setSelectedType] = useState<RequestType | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      selectedType,
      startDate,
      endDate,
      reason,
      emergencyContact,
      attachments,
    });
  };

  return (
    <div className="w-full">
      <Card>
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
            <Button type="submit" size="lg">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
