import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AlertCircle, Calendar as CalendarIcon, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { RequestType } from '../types';

const requestOptions = [
  { id: 'paid-leave', label: 'Paid Leave' },
  { id: 'unpaid-leave', label: 'Unpaid Leave' },
  { id: 'paid-sick-leave', label: 'Paid Sick Leave' },
  { id: 'unpaid-sick-leave', label: 'Unpaid Sick Leave' },
  { id: 'wfh', label: 'Work From Home (WFH)' },
];

export default function TimeOffRequest() {
  const [selectedType, setSelectedType] = useState<RequestType | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      selectedType,
      startDate,
      endDate,
      reason,
      emergencyContact,
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
            <div className="space-y-2">
              <Label className="font-regular text-sm">
                Request Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedType || ''}
                onValueChange={(value) => setSelectedType(value as RequestType)}
              >
                <SelectTrigger className="w-full max-w-xs focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  {requestOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <Label>
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {startDate
                          ? format(startDate, 'PPP')
                          : 'Select start date'}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {endDate ? format(endDate, 'PPP') : 'Select end date'}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

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
            <div className="space-y-2">
              <Label>Supporting Documents (Optional)</Label>
              <p className="text-xs text-muted-foreground">
                Upload medical certificate or other relevant documents
              </p>
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="file-upload"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition-colors hover:border-gray-400 hover:bg-gray-100"
                >
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload or drag and drop
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </label>
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border bg-white px-3 py-2"
                      >
                        <span className="truncate text-sm">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Important Notice */}
            <div className="flex items-start gap-3 rounded-lg border bg-gray-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Important:</p>
                <p className="text-sm text-muted-foreground">
                  Sick leave exceeding 3 days requires medical certificate. Your
                  request will be reviewed by your manager.
                </p>
              </div>
            </div>

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
